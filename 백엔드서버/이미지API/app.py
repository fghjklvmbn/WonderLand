import base64
from flask import Flask, request, jsonify
import torch
from transformers import AutoConfig, AutoModelForCausalLM
from janus.models import VLChatProcessor
from PIL import Image
import numpy as np
import io
import gc
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins="http://localhost:3001", supports_credentials=True)  # 클라이언트 주소만 허용
# -------------------
# 설정 (환경에 맞게 변경)
# -------------------
MODEL_PATH = "deepseek-ai/Janus-Pro-1B"
cuda_device = "cuda" if torch.cuda.is_available() else "cpu"

# 전역 캐시 (지연 로드)
vl_gpt = None
vl_chat_processor = None
tokenizer = None

# -------------------
# 모델 로드 / 준비 / 언로드 함수
# -------------------
def load_model(low_cpu_mem_usage=True, torch_dtype=torch.bfloat16):
    """모델을 (CPU에) 로드. GPU로 올리는 건 prepare_for_inference에서 수행."""
    global vl_gpt, vl_chat_processor, tokenizer
    if vl_gpt is not None:
        return

    config = AutoConfig.from_pretrained(MODEL_PATH)
    # 기존 코드와 동일하게 language_config 조정
    if hasattr(config, "language_config"):
        language_config = config.language_config
        try:
            language_config._attn_implementation = "eager"
        except Exception:
            pass
    else:
        language_config = None

    # low_cpu_mem_usage를 사용하여 초기 메모리 사용을 줄임
    vl_gpt = AutoModelForCausalLM.from_pretrained(
        MODEL_PATH,
        language_config=language_config,
        trust_remote_code=True,
        low_cpu_mem_usage=low_cpu_mem_usage,
        torch_dtype=torch_dtype
    )

    # 프로세서/토크나이저는 항상 로드
    vl_chat_processor = VLChatProcessor.from_pretrained(MODEL_PATH)
    tokenizer = vl_chat_processor.tokenizer

def prepare_for_inference():
    """실제로 GPU에서 추론을 수행하도록 모델을 GPU로 올림."""
    global vl_gpt
    if vl_gpt is None:
        load_model()

    # 모델이 이미 GPU에 있다면 패스
    # 일부 HF 모델에서 .device 를 검사
    try:
        device_of_param = next(vl_gpt.parameters()).device
    except StopIteration:
        device_of_param = torch.device("cpu")

    if device_of_param.type != "cuda" and cuda_device == "cuda":
        # float16 모델이라면 GPU로 옮기기 (속도/메모리 이득)
        vl_gpt.to(cuda_device)
        torch.cuda.empty_cache()

def unload_model(to_cpu=True, full_unload=False):
    """
    to_cpu=True : GPU -> CPU로 내림 (GPU 메모리 반환)
    full_unload=True : 모델 객체 삭제 (다음 요청 시 다시 로드)
    """
    global vl_gpt, vl_chat_processor, tokenizer
    if vl_gpt is None:
        return

    if full_unload:
        # 완전 삭제: GPU + CPU 메모리 모두 해제 (재로딩 필요)
        try:
            del vl_gpt
        except Exception:
            pass
        vl_gpt = None
        torch.cuda.empty_cache()
        gc.collect()
        return

    # CPU로 옮겨서 GPU VRAM만 반환
    try:
        vl_gpt.to("cpu")
    except Exception:
        # 일부 연산에서 float16 CPU 이동이 안되면 그냥 delete
        try:
            del vl_gpt
            vl_gpt = None
        except Exception:
            pass

    torch.cuda.empty_cache()
    gc.collect()

# -------------------
# 원래 이미지 생성 로직 (파라미터 순서, 타입 안정성 수정)
# -------------------
def generate(input_ids,
             width,
             height,
             cfg_weight,
             temperature,
             parallel_size: int = 1,
             image_token_num_per_image: int = None,
             patch_size: int = 16):
    """
    input_ids: 1D LongTensor (토크나이즈된 텍스트)
    width/height: 내부 생성 크기 (pixels). patch_size로 나누어짐.
    cfg_weight, temperature: 샘플링 파라미터
    parallel_size: 동시에 생성할 이미지 수 (GTX1080 -> 1 권장)
    image_token_num_per_image: 자동 계산 가능 (width/patch_size * height/patch_size)
    """
    global vl_gpt, vl_chat_processor
    torch.cuda.empty_cache()

    if image_token_num_per_image is None:
        image_token_num_per_image = (width // patch_size) * (height // patch_size)

    # tokens: (parallel_size*2, seq_len)
    tokens = torch.zeros((parallel_size * 2, len(input_ids)), dtype=torch.long).to(cuda_device)
    for i in range(parallel_size * 2):
        tokens[i, :] = input_ids
        if i % 2 != 0:
            tokens[i, 1:-1] = vl_chat_processor.pad_id

    inputs_embeds = vl_gpt.language_model.get_input_embeddings()(tokens)
    generated_tokens = torch.zeros((parallel_size, image_token_num_per_image), dtype=torch.long).to(cuda_device)
    pkv = None

    for i in range(image_token_num_per_image):
        outputs = vl_gpt.language_model.model(inputs_embeds=inputs_embeds, use_cache=True, past_key_values=pkv)
        pkv = outputs.past_key_values
        hidden_states = outputs.last_hidden_state
        logits = vl_gpt.gen_head(hidden_states[:, -1, :])
        logit_cond = logits[0::2, :]
        logit_uncond = logits[1::2, :]
        logits = logit_uncond + cfg_weight * (logit_cond - logit_uncond)
        probs = torch.softmax(logits / max(temperature, 1e-6), dim=-1)
        next_token = torch.multinomial(probs, num_samples=1)
        generated_tokens[:, i] = next_token.squeeze(dim=-1)
        next_token = torch.cat([next_token.unsqueeze(dim=1), next_token.unsqueeze(dim=1)], dim=1).view(-1)
        img_embeds = vl_gpt.prepare_gen_img_embeds(next_token)
        inputs_embeds = img_embeds.unsqueeze(dim=1)

    patches = vl_gpt.gen_vision_model.decode_code(
        generated_tokens.to(dtype=torch.long),
        shape=[parallel_size, (width // patch_size), (height // patch_size), 1] if False else [parallel_size, 8, width // patch_size, height // patch_size]
    )

    return generated_tokens.to(dtype=torch.long), patches

def unpack(dec, width, height, parallel_size=1):
    # dec shape assumed: (parallel_size, channels, Hpatch, Wpatch) -> 처리
    dec = dec.to(torch.float32).cpu().numpy().transpose(0, 2, 3, 1)
    dec = np.clip((dec + 1) / 2 * 255, 0, 255).astype(np.uint8)

    visual_img = np.zeros((parallel_size, width, height, 3), dtype=np.uint8)
    visual_img[:, :, :] = dec
    return visual_img

# -------------------
# 상위 래퍼: 내부 해상도/병렬 수를 low_memory에 따라 조정
# -------------------
@torch.inference_mode()
def generate_image(prompt, seed, cfg_weight, temperature, low_memory=True, offload=True, full_unload=False):
    """
    low_memory=True: GTX1080용 권장값 적용 (width=256, parallel_size=1)
    offload=True: 끝나고 GPU->CPU로 내림 (또는 full_unload=True면 완전 삭제)
    """
    global vl_chat_processor, tokenizer

    # 모델 준비 (CPU에 로드되어 있다가 아래에서 GPU로 올림)
    load_model(low_cpu_mem_usage=True, torch_dtype=torch.bfloat16)
    prepare_for_inference()  # GPU로 올림(필요시)

    # 난수 시드
    seed = seed if seed is not None else 12345
    torch.manual_seed(seed)
    if cuda_device == "cuda":
        torch.cuda.manual_seed(seed)
    np.random.seed(seed)

    # GTX1080 권장(저메모리): 내부 256x256, 병렬 1
    if low_memory:
        width = 384
        height = 384
        parallel_size = 5
    else:
        width = 384
        height = 384
        parallel_size = 5
        # width = 384
        # height = 384
        # parallel_size = 5  # 단, GTX1080에서는 메모리 부족 가능

    with torch.no_grad():
        messages = [{'role': 'User', 'content': prompt}, {'role': 'Assistant', 'content': ''}]
        text = vl_chat_processor.apply_sft_template_for_multi_turn_prompts(
            conversations=messages,
            sft_format=vl_chat_processor.sft_format,
            system_prompt=''
        )
        text = text + vl_chat_processor.image_start_tag
        input_ids = torch.LongTensor(tokenizer.encode(text)).to(cuda_device)

        # generate 함수 호출: (input_ids, width, height, cfg_weight, temperature, parallel_size)
        _, patches = generate(input_ids,
                              width,
                              height,
                              cfg_weight,
                              temperature,
                              parallel_size=parallel_size,
                              image_token_num_per_image=(width // 16) * (height // 16),
                              patch_size=16)
        images = unpack(patches, width // 16 * 16, height // 16 * 16, parallel_size=parallel_size)

        # 요청 후 오프로딩/언로드
        if offload:
            unload_model(to_cpu=True, full_unload=full_unload)

        # PIL 이미지로 변환 (원본보다 크게 리사이즈해서 반환 가능)
        return [Image.fromarray(images[i]).resize((384, 384), Image.LANCZOS) for i in range(parallel_size)]


# -------------------
# Flask 엔드포인트
# -------------------
@app.route("/AI/Art/Create", methods=["POST"])
def generate_images():
    data = request.json or {}
    prompt = str(data.get("prompt", "")).strip()
    seed = data.get("seed", None)
    cfg_weight = data.get("cfg_weight", 1.0)
    temperature = data.get("temperature", 1.0)
    low_memory = bool(data.get("low_memory", True))   # 기본 True (GTX1080 권장)
    offload = bool(data.get("offload", True))         # 기본 True
    full_unload = bool(data.get("full_unload", False))  # 완전 삭제 옵션

    # ------------------------
    # 🔒 입력값 검증 및 제한
    # ------------------------
    if not prompt or len(prompt) < 3:
        return jsonify({"status": False, "detail": "프롬프트는 최소 3자 이상 입력해야 합니다."}), 400

    try:
        seed = int(seed) if seed is not None else 12345
    except Exception:
        return jsonify({"status": False, "detail": "seed는 정수여야 합니다."}), 400

    try:
        cfg_weight = float(cfg_weight)
        if not (0.1 <= cfg_weight <= 20.0):
            return jsonify({"status": False, "detail": "cfg_weight는 0.1 ~ 20.0 범위여야 합니다."}), 400
    except Exception:
        return jsonify({"status": False, "detail": "cfg_weight는 숫자여야 합니다."}), 400

    try:
        temperature = float(temperature)
        if not (0.1 <= temperature <= 1.0):
            return jsonify({"status": False, "detail": "temperature는 0.1 ~ 1.0 범위여야 합니다."}), 400
    except Exception:
        return jsonify({"status": False, "detail": "temperature는 숫자여야 합니다."}), 400

    # ------------------------
    # 모델 실행
    # ------------------------
    try:
        images = generate_image(prompt, seed, cfg_weight, temperature,
                                low_memory=low_memory, offload=offload, full_unload=full_unload)

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

        return jsonify({"status": True, "image_output": image_output}), 200

    except Exception as e:
        try:
            unload_model(to_cpu=False, full_unload=True)
        except Exception:
            pass
        return jsonify({"status": False, "detail": f"이미지 생성 실패: {str(e)}"}), 500



@app.route("/AI/Art")
def ping():
    return jsonify({"message": "이미지 서비스 정상작동"}), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
