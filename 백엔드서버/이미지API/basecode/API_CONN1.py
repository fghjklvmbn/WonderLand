import requests
import base64
import uuid
import os

# Gradio 서버의 predict 엔드포인트 URL
url = "http://127.0.0.1:7860/run/predict"
i = 0

output_dir = "output"
os.makedirs(output_dir, exist_ok=True)

# 요청 페이로드
payload = {
    "data": ["trees", 42, 5.5, 0.7],
    "fn_index": 2,
    "session_hash": str(uuid.uuid4())
}
headers = {"Content-Type": "application/json"}

# POST 요청 보내기
resp = requests.post(url, json=payload, headers=headers)
resp.raise_for_status()
result = resp.json()

# Base64 결과를 담을 리스트
base64_images = []

# 응답에서 파일 경로 가져와서 Base64로 변환
if "data" in result and isinstance(result["data"], list):
    # 첫 번째 element가 이미지 리스트
    images = result["data"][0]
    for image_info in images:
        # Gradio가 반환한 임시 파일 경로
        img_path = image_info.get("name")
        if img_path and os.path.isfile(img_path):
            with open(img_path, "rb") as img_file:
                b64str = base64.b64encode(img_file.read()).decode("utf-8")
                base64_images.append({
                    "orig_name": image_info.get("orig_name", os.path.basename(img_path)),
                    "b64": b64str,
                })
            # 원하지 않으면 임시 파일 삭제
            os.remove(img_path)
        else:
            print(f"파일을 찾을 수 없음: {img_path}")

# 결과 출력 (또는 DB 저장 등 원하는 처리)
for img in base64_images:
    print(f"--- {img['orig_name']} (Base64) ---")
    print(img["b64"][:100] + "...")  # 출력이 너무 길면 앞부분만

    # png 파일로 저장
    png_filename = f"{img['orig_name'][:4]}{[i]}.png"
    png_path = os.path.join(output_dir, png_filename)
    with open(png_path, "w", encoding="utf-8") as f:
        f.write(b64str)
    i += 1