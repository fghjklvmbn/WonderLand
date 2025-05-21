# app.py
from flask import Flask, request, jsonify
from create_pic import generate_and_export_images

app = Flask(__name__)

@app.route("/AI/Art/Create", methods=["POST"])
def create_pic():
    data = request.json or {}
    prompt = data.get("prompt")
    seed = data.get("seed")
    cfg_weight = data.get("cfg_weight")
    temperature = data.get("temperature")

    result = generate_and_export_images(prompt, seed, cfg_weight, temperature)
    status = 200 if result["success"] else 500
    return jsonify(result), status

def ping():
    status = 200
    return jsonify("pong"), status


if __name__ == "__main__":
    app.run(port=5000, debug=True)
