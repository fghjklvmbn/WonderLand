import torch, re
import platform
# from transformers import AutoTokenizer, AutoModelForCausalLM
# Windows/Linux: Hugging Face, Apple: MLX
try:
    from transformers import AutoTokenizer, AutoModelForCausalLM
except ImportError:
    pass

try:
    from mlx_lm import load, generate  # Apple Silicon MLX
except ImportError:
    pass

import os

# 처음엔 없음
model = None
tokenizer = None

def load_model():
    global model, tokenizer

    if model is None or tokenizer is None:

        # Mac M1/M2/M3 (Apple Silicon) + MLX
        if torch.backends.mps.is_available() or platform.system() == "Darwin":
            base_model_path = "Qwen/Qwen3-4B-MLX-4bit"
            model, tokenizer = load(base_model_path)
            # MLX는 device 관리 자동
        else:
            # Windows/Linux (CUDA 가능 또는 CPU fallback)
            base_model_path = "Qwen/Qwen3-4B"
            tokenizer = AutoTokenizer.from_pretrained(base_model_path)

            model = AutoModelForCausalLM.from_pretrained(
                base_model_path,
                torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
                device_map="auto" if torch.cuda.is_available() else "cpu"
            )

            device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
            model.to(device)

        # Adapter Model 로드 (필요시)
        # model = PeftModel.from_pretrained(model, "./storybook_model")

    return model, tokenizer


# 템플릿 로드 함수
def load_prompt_template(path):
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

# 사용자 프롬프트 템플릿별 로드
def format_prompt(data, templete):
    templete = load_prompt_template(templete)
    prompt = """사용자 작성내용 : """ + data + templete
    return prompt

def strip_think_tags(text: str) -> str:
    return re.sub(r"user.*?assistant\n<think>.*?</think>\n\n", "", text, flags=re.DOTALL)


def generate_txt(data, templete):
    model, tokenizer = load_model()
    prompt = format_prompt(data, templete)

    messages = [
            {"role": "user", "content": prompt}
        ]
    
    # Mac/MLX 환경
    if torch.backends.mps.is_available() or platform.system() == "Darwin":
        # MLX 방식: apply chat template → generate with MLX_LM
        text_template = tokenizer.apply_chat_template(
            messages,
            tokenize=False,
            add_generation_prompt=True,
            enable_thinking=False
        )

        # MLX generate 함수 문서에 보면: generate(model, tokenizer, prompt=text, max_tokens=..., verbose=...)
        response = generate(
            model, 
            tokenizer, 
            prompt=text_template, 
            max_tokens=32000,      # MLX_LM의 최대 생성 토큰 수 옵션
            verbose=False
        )

        # 문서 보면 generate는 이미 문자열을 리턴하는 걸로 나와있고, decode 필요 없을 수도 있음
        # strip 생각 태그도 붙여 정리
        response = strip_think_tags(response.strip())

    # Windows/Linux Hugging Face 환경
    else:
        text = tokenizer.apply_chat_template(
            messages,
            tokenize=False,
            add_generation_prompt=True,
            enable_thinking=False
        )
        model_inputs = tokenizer([text], return_tensors="pt").to(model.device)
        generated_ids = model.generate(
            **model_inputs,
            temperature=0.5,
            max_new_tokens=32768
        )
        output_ids = generated_ids[0][len(model_inputs.input_ids[0]):].tolist()
        response = strip_think_tags(tokenizer.decode(output_ids, skip_special_tokens=True).strip())

    return response

# def generate(data, templete):
#     model, tokenizer = load_model()
#     prompt = format_prompt(data, templete)
#     messages = [
#         {"role": "user", "content": prompt}
#     ]
#     text = tokenizer.apply_chat_template(
#         messages,
#         tokenize=False,
#         add_generation_prompt=True,
#         enable_thinking=False # Switches between thinking and non-thinking modes. Default is True.
#     )
#     model_inputs = tokenizer([text], return_tensors="pt").to(model.device)

#     # conduct text completion
#     generated_ids = model.generate(
#         **model_inputs,
#         temperature=0.5,
#         max_new_tokens=32768
#     )
#     output_ids = generated_ids[0][len(model_inputs.input_ids[0]):].tolist() 
#     response = strip_think_tags(tokenizer.decode(output_ids, skip_special_tokens=True).strip())
#     return response

