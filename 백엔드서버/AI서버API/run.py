from flask import Flask, request, jsonify
from flask_cors import CORS
from functions.Chatbot import chat
from functions.base import generate_txt
from functions.translate import translate_text
import os, json, platform

# 현재 파일 위치
path = os.getcwd()
app = Flask(__name__)

CORS(app, resources={r"/ai/*": {"origins": "http://localhost:3001"}}, supports_credentials=True)

# 전체적인 이야기 생성
@app.route("/ai/StoryCreate/generate", methods=["POST"])
def generate_story():
    data = request.get_json()
    prompt = data.get("prompt", "")
    custom_tag = data.get("custom_tag", "")
    
    # 사용자 지정 태그가 있으면 프롬프트에 추가
    prompt += f"\n사용자 지정 태그: {custom_tag}" if custom_tag else ""
    templete = os.path.join(os.getcwd(), "functions", "templete", "createstory.txt")
    
    if not prompt:
        return jsonify({"오류": "프롬프트(prompt) 항목은 필수 입니다."}), 400
    
    result = generate_txt(prompt, templete)
    first_parse = json.loads(result)     # result: 문자열
    return jsonify(first_parse)

# 이야기 생성(5페이지)
@app.route("/ai/StoryCreate/write", methods=["POST"])
def write_detail_story():
    data = request.get_json()
    prompt = data.get("prompt")
    # JSON을 예쁘게 포맷해서 문자열로 만들기
    pretty_json = json.dumps(prompt, ensure_ascii=False, indent=4)

    # 삼중 따옴표로 감싸기
    # wrapped_json = f'"""{pretty_json}"""'
    wrapped_json = pretty_json
    
    # 전용 템플릿 전달
    templete = os.path.join(os.getcwd(), "functions", "templete", "detail.txt")
    
    if not prompt:
        return jsonify({"오류": "프롬프트(prompt) 항목은 필수 입니다."}), 400
    
    # write_story 함수를 호출하여 이야기를 생성한다.
    result = generate_txt(wrapped_json, templete)
    first_parse = json.loads(result)     # result: 문자열
    return jsonify(first_parse)

# 이야기 수정
@app.route("/ai/StoryCreate/modify", methods=["POST"])
def modify_story():
    prompt = request.get_json()

    # JSON을 예쁘게 포맷해서 문자열로 만들기
    pretty_json = json.dumps(prompt, ensure_ascii=False, indent=4)

    # 삼중 따옴표로 감싸기
    wrapped_json = f'"""{pretty_json}"""'
    
    # 전용 템플릿 전달
    templete = os.path.join(os.getcwd(), "functions", "templete", "modify.txt")
    
    if not prompt:
        return jsonify({"오류": "프롬프트(prompt) 항목은 필수 입니다."}), 400
    
    result = generate_txt(wrapped_json, templete)
    first_parse = json.loads(result)     # result: 문자열
    return jsonify(first_parse)

# 등장인물 자세한 정보 생성
@app.route("/ai/StoryCreate/charspec", methods=["POST"])
def character_spec():
    prompt = request.get_json()

    # JSON을 예쁘게 포맷해서 문자열로 만들기
    pretty_json = json.dumps(prompt, ensure_ascii=False, indent=4)

    # 삼중 따옴표로 감싸기
    wrapped_json = f'"""{pretty_json}"""'

    # 전용 템플릿 전달
    templete = os.path.join(os.getcwd(), "functions", "templete", "charspec.txt")

    if not prompt:
        return jsonify({"오류": "프롬프트(prompt) 항목은 필수 입니다."}), 400
    
    result = generate_txt(wrapped_json, templete)
    first_parse = json.loads(result)     # result: 문자열
    return jsonify(first_parse)

# 페이지내 그림 프롬프트 정보 생성
@app.route("/ai/StoryCreate/artprompt", methods=["POST"])
def artprompt():
    prompt = request.get_json()

    # JSON을 예쁘게 포맷해서 문자열로 만들기
    pretty_json = json.dumps(prompt, ensure_ascii=False, indent=4)

    # 삼중 따옴표로 감싸기
    wrapped_json = f'"""{pretty_json}"""'

    # 전용 템플릿 전달
    templete = os.path.join(os.getcwd(), "functions", "templete", "artprompt.txt")

    if not prompt:
        return jsonify({"오류": "프롬프트(prompt) 항목은 필수 입니다."}), 400
    
    result = generate_txt(wrapped_json, templete)
    first_parse = json.loads(result)     # result: 문자열
    return jsonify(first_parse)

# 페이지내 그림 프롬프트 정보 생성
@app.route("/ai/StoryCreate/create", methods=["POST"])
def create_new():
    prompt = request.get_json()

    # JSON을 예쁘게 포맷해서 문자열로 만들기
    pretty_json = json.dumps(prompt, ensure_ascii=False, indent=4)

    # 삼중 따옴표로 감싸기
    wrapped_json = f'"""{pretty_json}"""'

    # 전용 템플릿 전달
    templete = os.path.join(path, "functions", "templete", "create.txt")

    if not prompt:
        return jsonify({"오류": "프롬프트(prompt) 항목은 필수 입니다."}), 400
    
    result = generate_txt(wrapped_json, templete)
    first_parse = json.loads(result)     # result: 문자열
    return jsonify(first_parse)

# 챗봇 대화 기능
@app.route("/ai/chat", methods=["POST"])
def chatting():
    data = request.get_json()
    user_input = data.get('prompt', '')
    
    if not user_input:
        return jsonify({'error': '질문이 비어있습니다. 다시 입력해주세요'}), 400

    try:
        response = chat(user_input)
        return jsonify({'output': response})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 번역 기능
@app.route("/ai/translate", methods=["POST"])
def translate():
    data = request.get_json()
    text = data.get("text", "")
    target_language = data.get("target_language", "en")

    if not text:
        return jsonify({"error": "번역할 텍스트가 필요합니다."}), 400

    translated_text = translate_text(text, target_language)
    return jsonify({"translated_text": translated_text})

@app.route("/ai/StoryCreate", methods=["GET"])
def index():
    return jsonify({"message": "AI 서비스 정상작동"}), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3000, debug=True)
