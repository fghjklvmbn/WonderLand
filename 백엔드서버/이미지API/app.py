# 구조 스와핑 -> 타 코드 + 프로젝트 코드
import base64
from flask import Flask, request, jsonify
import torch
from transformers import AutoConfig, AutoModelForCausalLM
from janus.models import VLChatProcessor
from PIL import Image
import numpy as np
import io

app = Flask(__name__)

# 모델 및 프로세서 로딩
model_path = "deepseek-ai/Janus-Pro-1B"
config = AutoConfig.from_pretrained(model_path)
language_config = config.language_config
language_config._attn_implementation = 'eager'
vl_gpt = AutoModelForCausalLM.from_pretrained(model_path,
                                              language_config=language_config,
                                              trust_remote_code=True)
vl_gpt = vl_gpt.to(torch.bfloat16).cuda()

vl_chat_processor = VLChatProcessor.from_pretrained(model_path)
tokenizer = vl_chat_processor.tokenizer
cuda_device = 'cuda' if torch.cuda.is_available() else 'cpu'

# 사용 : AI 생성 파트
def generate(input_ids,
             width,
             height,
             temperature,
             cfg_weight,
             parallel_size: int = 5,
             image_token_num_per_image: int = 576,
             patch_size: int = 16):
    torch.cuda.empty_cache()

    tokens = torch.zeros((parallel_size * 2, len(input_ids)), dtype=torch.int).to(cuda_device)
    for i in range(parallel_size * 2):
        tokens[i, :] = input_ids
        if i % 2 != 0:
            tokens[i, 1:-1] = vl_chat_processor.pad_id
    inputs_embeds = vl_gpt.language_model.get_input_embeddings()(tokens)
    generated_tokens = torch.zeros((parallel_size, image_token_num_per_image), dtype=torch.int).to(cuda_device)

    pkv = None

    # 토큰수 만큼 이미지 생성 반복(vl_gpt)
    for i in range(image_token_num_per_image):
        outputs = vl_gpt.language_model.model(inputs_embeds=inputs_embeds, use_cache=True, past_key_values=pkv)
        pkv = outputs.past_key_values
        hidden_states = outputs.last_hidden_state
        logits = vl_gpt.gen_head(hidden_states[:, -1, :])
        logit_cond = logits[0::2, :]
        logit_uncond = logits[1::2, :]
        logits = logit_uncond + cfg_weight * (logit_cond - logit_uncond)
        probs = torch.softmax(logits / temperature, dim=-1)
        next_token = torch.multinomial(probs, num_samples=1)
        generated_tokens[:, i] = next_token.squeeze(dim=-1)
        next_token = torch.cat([next_token.unsqueeze(dim=1), next_token.unsqueeze(dim=1)], dim=1).view(-1)
        img_embeds = vl_gpt.prepare_gen_img_embeds(next_token)
        inputs_embeds = img_embeds.unsqueeze(dim=1)
    patches = vl_gpt.gen_vision_model.decode_code(
        generated_tokens.to(dtype=torch.int),
        shape=[parallel_size, 8, width // patch_size, height // patch_size]
    )

    return generated_tokens.to(dtype=torch.int), patches

# 사용(체인로딩)
def unpack(dec, width, height, parallel_size=5):
    dec = dec.to(torch.float32).cpu().numpy().transpose(0, 2, 3, 1)
    dec = np.clip((dec + 1) / 2 * 255, 0, 255)

    visual_img = np.zeros((parallel_size, width, height, 3), dtype=np.uint8)
    visual_img[:, :, :] = dec

    return visual_img

# 사용 메인함수
@torch.inference_mode()
def generate_image(prompt, seed, cfg_weight, temperature):
    torch.cuda.empty_cache()
    seed = seed if seed is not None else 12345
    torch.manual_seed(seed)
    torch.cuda.manual_seed(seed)
    np.random.seed(seed)

    # 가로세로 크기 정렬(조정시 토큰값이 변동되므로 맟춰야 함, 웬만하면 건들지 말아야함)
    width = 384
    height = 384
    
    # 그림 5장 생성
    parallel_size = 5
    
    with torch.no_grad():
        messages = [{'role': 'User', 'content': prompt}, {'role': 'Assistant', 'content': ''}]
        text = vl_chat_processor.apply_sft_template_for_multi_turn_prompts(
            conversations=messages,
            sft_format=vl_chat_processor.sft_format,
            system_prompt=''
        )
        text = text + vl_chat_processor.image_start_tag
        input_ids = torch.LongTensor(tokenizer.encode(text))
        _, patches = generate(input_ids, width // 16 * 16, height // 16 * 16, temperature, cfg_weight, parallel_size=parallel_size)
        images = unpack(patches, width // 16 * 16, height // 16 * 16)

        return [Image.fromarray(images[i]).resize((1024, 1024), Image.LANCZOS) for i in range(parallel_size)]


@app.route("/AI/Art/Create", methods=["POST"])
def generate_images():
    data = request.json or {}
    prompt = data.get("prompt")
    seed = data.get("seed")
    cfg_weight = data.get("cfg_weight")
    temperature = data.get("temperature")

    # 타입변환
    prompt = str(prompt)
    seed = int(seed)
    cfg_weight = float(cfg_weight)
    temperature = int(temperature)

    try:
        # 이미지 생성
        images = generate_image(prompt, seed, cfg_weight, temperature)

        # base64 변환 + 순번 filename 생성
        image_output = []
        for idx, img in enumerate(images, start=1):
            buf = io.BytesIO()
            img.save(buf, format="PNG")
            byte_data = buf.getvalue()
            base64_str = base64.b64encode(byte_data).decode("utf-8")

            image_output.append({
                "filename": f"image_{idx}.png",
                "base64": base64_str
            })

        # 원하는 출력 구조
        return jsonify({
            "status": True,
            "image_output": image_output
        }), 200

    except Exception as e:
        return jsonify({
            "status": False,
            "detail": f"이미지 생성에 실패하였습니다: {str(e)}"
        }), 500

@app.route("/ai/Art")
def ping():
    status = 200
    return jsonify({"message": "이미지 서비스 정상작동"}), status


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
