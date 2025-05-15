import requests
import base64
import uuid
import os

# 생성된 txt 파일 저장 폴더
output_dir = "output"
os.makedirs(output_dir, exist_ok=True)

# Gradio 서버 predict 엔드포인트
url = "http://127.0.0.1:7860/run/predict"

# 요청 구성
payload = {
    "data": ["a fantasy tree in the moonlight", 42, 5.5, 0.7],
    "fn_index": 2,
    "session_hash": str(uuid.uuid4())
}
headers = {"Content-Type": "application/json"}

# 요청 전송
resp = requests.post(url, json=payload, headers=headers)
resp.raise_for_status()
result = resp.json()

# Base64 문자열로 변환하여 txt 파일로 저장
if "data" in result and isinstance(result["data"], list):
    images = result["data"][0]
    for idx, image_info in enumerate(images):
        img_path = image_info.get("name")
        if img_path and os.path.isfile(img_path):
            with open(img_path, "rb") as img_file:
                b64str = base64.b64encode(img_file.read()).decode("utf-8")

            # txt 파일로 저장
            txt_filename = f"image_{idx}.txt"
            txt_path = os.path.join(output_dir, txt_filename)
            with open(txt_path, "w", encoding="utf-8") as f:
                f.write(b64str)

            print(f"✅ 저장 완료: {txt_path}")

            # 임시 이미지 삭제 (선택사항)
            os.remove(img_path)
        else:
            print(f"❌ 파일 없음: {img_path}")
