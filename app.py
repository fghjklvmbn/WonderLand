from flask import Flask, request, jsonify
from translate import translate_text

app = Flask(__name__)

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


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3000, debug=True)
