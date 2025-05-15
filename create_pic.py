# create_pic.py
import requests
import base64
import uuid
import os
import shutil

GRADIO_URL = "http://127.0.0.1:7860/run/predict"
GRADIO_TEMP_DIR = os.path.expandvars(r"%LOCALAPPDATA%\Temp\gradio")
OUTPUT_DIR = "output"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def get_latest_folders(path, count=5):
    folders = [
        os.path.join(path, d)
        for d in os.listdir(path)
        if os.path.isdir(os.path.join(path, d))
    ]
    folders.sort(key=lambda x: os.path.getmtime(x), reverse=True)
    return folders[:count]

def generate_and_export_images(prompt, seed, cfg_weight, temperature):
    payload = {
        "data": [prompt, seed, cfg_weight, temperature],
        "fn_index": 2,
        "session_hash": str(uuid.uuid4())
    }
    headers = {"Content-Type": "application/json"}

    try:
        resp = requests.post(GRADIO_URL, json=payload, headers=headers)
        resp.raise_for_status()
    except Exception as e:
        return {"success": False, "error": f"Gradio 서버 요청 실패: {str(e)}"}

    # 1. 최근 5개 폴더
    base64_images = []
    recent_folders = get_latest_folders(GRADIO_TEMP_DIR, count=5)

    for i, folder in enumerate(recent_folders):
        image_path = os.path.join(folder, "image.png")
        if os.path.exists(image_path):
            try:
                with open(image_path, "rb") as img_file:
                    b64str = base64.b64encode(img_file.read()).decode("utf-8")

                filename = f"image_{i}.txt"
                txt_path = os.path.join(OUTPUT_DIR, filename)
                with open(txt_path, "w", encoding="utf-8") as out_file:
                    out_file.write(b64str)

                shutil.rmtree(folder)  # 폴더 제거

            except Exception as e:
                print(f"⚠️ 변환 실패: {image_path} | 에러: {e}")
        else:
            print(f"❌ 이미지 없음: {image_path}")

    # 2. 저장된 txt 파일 다시 읽어서 JSON 응답에 포함
    for fname in sorted(os.listdir(OUTPUT_DIR)):
        if fname.endswith(".txt"):
            fpath = os.path.join(OUTPUT_DIR, fname)
            try:
                with open(fpath, "r", encoding="utf-8") as f:
                    b64 = f.read()
                    base64_images.append({
                        "filename": fname,
                        "base64": b64
                    })
            except Exception as e:
                print(f"❌ {fname} 읽기 실패: {e}")

    return {"success": True, "images": base64_images}
