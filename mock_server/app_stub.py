from flask import Flask, request, jsonify
from stub.WriteDetail_stub import WriteDetail as write_detail_stub
from stub.FullCreate_stub import FullCreate as full_create_stub
from stub.CharaterSpecific_stub import CharaterSpecific as character_specific_stub
from stub.pageprompt_stub import PagePrompt as pageprompt_stub

app = Flask(__name__)


@app.route("/AI/StoryCreate/", methods=["GET"])
def index():
    return jsonify({"message": "정상작동"})

# 1. 전체 이야기 생성
@app.route("/ai/StoryCreate/FullCreate", methods=["POST"])
def full_create():
    data = request.get_json()
    prompt = data.get("prompt", "")
    custom_tag = data.get("custom_tag", "")
    
    if not prompt:
        return jsonify({"오류": "프롬프트(prompt) 항목은 필수 입니다."}), 400
    if not custom_tag:
        return jsonify({"오류": "커스텀 태그(custom_tag) 항목은 필수 입니다."}), 400

    result = full_create_stub(prompt, custom_tag)
    return jsonify(result)


# 2. 상세 페이지 이야기 생성
@app.route("/ai/StoryCreate/WriteDetail", methods=["POST"])
def write_detail():
    data = request.get_json()

    page = data.get("page", "")
    story = data.get("story", "")
    
    if not page:
        return jsonify({"오류": "페이지(page) 항목은 필수 입니다."}), 400
    if not story:
        return jsonify({"오류": "스토리(story) 항목은 필수 입니다."}), 400
    
    result = write_detail_stub(page, story)
    return jsonify(result)


# 3. 캐릭터 세부 생성
@app.route("/ai/StoryCreate/CharaterSpecific", methods=["POST"])
def character_specific():
    data = request.get_json()
    character_name = data.get("character_name", "")
    plot = data.get("plot", "")
    
    if not character_name:
        return jsonify({"오류": "캐릭터(character_name) 항목은 필수 입니다."}), 400
    if not plot:
        return jsonify({"오류": "줄거리(plot) 항목은 필수 입니다."}), 400

    result = character_specific_stub(character_name, plot)
    return jsonify(result)

# 4. 페이지 내용 기반 이미지 생성 프롬프트 생성
@app.route("/ai/StoryCreate/CharaterSpecific", methods=["POST"])
def character_specific():
    data = request.get_json()
    detail = data.get("detail", "")
    
    if not detail:
        return jsonify({"오류": "페이지 내용(detail) 항목은 필수 입니다."}), 400

    result = pageprompt_stub(detail)
    return jsonify(result)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3001, debug=True)