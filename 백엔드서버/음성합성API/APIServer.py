import io
import os
import sys
import json
import shutil
import subprocess
from threading import Thread
from typing import Optional
from werkzeug.exceptions import HTTPException

import SQLConnect
import elevenConnect


from flask import (
    Flask, jsonify, request, abort, send_file
)
from flask_cors import CORS
from werkzeug.utils import secure_filename

if sys.stdout.encoding is None or sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

app = Flask(__name__)
CORS(app)

### SERVER CHECK
@app.route('/api/health', methods=['GET'])
def healthCheck():
    return jsonify({"status":"ok"}),200



### MODEL CREATE
@app.route("/api/model/create", methods=['GET'])
def create_get_help():
    abort(405, description="[POST] audio(사용자 음성.mp3), model_name")

@app.route("/api/model/create",methods=['POST'])
def processModelCreate():
    audio_file = request.files.get('audio')
    if not audio_file:
        abort(400, description="오디오 파일을 찾을 수 없습니다.")

    file_name = secure_filename(audio_file.filename) #파일명 정제
    if not file_name:
        abort(400, description="오디오 파일 이름이 잘못 되었습니다.")

    dataset_name = request.form.get("model_name","").strip()
    if not dataset_name:
        abort(400, description="모델 이름을 파일을 찾을 수 없습니다.")

    audio_bytes = audio_file.read()

    thread = Thread(target=threadModelCreate,
                    args=(dataset_name, audio_bytes), daemon=True)
    thread.start()

    return jsonify({
        "status":"started",
        "dataset_name" : dataset_name,
    }), 202 #작업 시작 알림

def threadModelCreate(model_name: str, audio_bytes : bytes):
    try:
        SQLConnect.createModel(model_name=model_name, voice_code= voice_id, status="Process")
        voice_id = elevenConnect.createVoiceModel(audio_bytes, name=model_name)
        SQLConnect.createModel(model_name=model_name, voice_code= voice_id, status="Done")
    except Exception as e:
        print(f"[threadModelCreate] Fail: {e}")
        SQLConnect.createModel(model_name=model_name, voice_code="", status="Fail")

### MODEL DELETE
@app.route("/api/model/delete", methods=["DELETE"])
def process_delete_models():
    model_name = request.args.get("model_name","").strip()
    if not model_name:
        abort(400, description="model_name이 필요합니다")
    deleteResult = SQLConnect.deleteModel(model_name)
    if deleteResult:
        return jsonify({
            "model_name" : model_name,
            "status": "deleted"
            }), 200
    else:
        abort(500, description="model 삭제를 실패하였습니다.")

### MODEL STATUS CHECK
@app.route("/api/model/check", methods=["GET"])
def processModelCheck():
    model_name = request.args.get("model_name","").strip()
    if not model_name:
        abort(400, description="model_name이 필요합니다")
    checkResult = SQLConnect.checkModel(model_name)

    if checkResult is None:
        return jsonify({
            "model_name" : model_name,
            "status": "None"
            }), 200  #추후 테스트 후 수정필요
    else:
        return jsonify({
            "model_name" : model_name,
            "status": checkResult
            }), 200
    
### SHOW MODELS
@app.route("/api/model/show", methods=["GET"])
def process_show_models():
    try:
        return jsonify(SQLConnect.showModels()), 200
    except Exception as e:
        abort(500, description="모델 목록을 불러올 수 없습니다.")


###CREATE VOICE (X) 책을 생성하는 호출 함수로 만들어서 사용해야할 듯 이건 테스트 용으로 수정
@app.route("/api/voice/create", methods=['POST'])
def process_voice_create():
    model_name = request.form.get("model_name").strip()
    book_id = request.form.get("book_id").strip()
    input_text = request.form.get("text").strip()
    if not model_name or not input_text or not book_id:
        abort(400, description="model_name, text, book_id를 확인해주세요.")


### 에러 응답 처리
@app.errorhandler(HTTPException)
def handle_http_exception(e):
    response = e.get_response()
    response.data = json.dumps({
        "error": e.description
    }, ensure_ascii=False)
    response.content_type = "application/json; charset=utf-8"
    return response, e.code

### 테스트
def debug_addModel():
    SQLConnect.debug_createModel("test","12345","Fail")
    SQLConnect.debug_createModel("test2","12345","Done")
    SQLConnect.debug_createModel("test3","12345","Process")
    SQLConnect.deleteModel("test")




if __name__ == "__main__":
    SQLConnect.defaultSetting() #데이터베이스 체크
    debug_addModel()
    app.run(host="0.0.0.0", port=6000, debug=True) #디버그 모드


