import requests

url = "http://127.0.0.1:7860/run/predict"  # 실제 엔드포인트로 변경 필요
payload = {
    "data": ["a fantasy tree in the moonlight", 42, 5.5, 0.7],
    "fn_index": 2,
    "session_hash": "your_session_hash"  # 필요에 따라 설정
}

response = requests.post(url, json=payload)
print(response.json())
