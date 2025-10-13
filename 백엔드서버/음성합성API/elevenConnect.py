from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs
from elevenlabs.play import play
from io import BytesIO
import os
import sys
import logging

if sys.stdout.encoding is None or sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

load_dotenv()
_apiKey = ElevenLabs(api_key=os.getenv("XI_API_KEY"))

def createVoiceModel(audio_bytes:bytes, name:str="sampleVoice") -> str:
    if not audio_bytes or not isinstance(audio_bytes, (bytes, bytearray)):
        raise ValueError("음성파일 형태가 잘못되었습니다.")
    
    voice = _apiKey.voices.ivc.create(
        name=name,
        files=[BytesIO(audio_bytes)]
    )

    return voice.voice_id

def createVoice(voice_code:str, text:str, save_path:str) -> bool:
    if not voice_code.strip() or not isinstance(voice_code, str):
        raise ValueError("voice_code가 올바르지 않습니다.")
    if not text.strip() or not isinstance(text, str):
        raise ValueError("text가 올바르지 않습니다.")
    if not save_path.strip() or not isinstance(save_path, str):
        raise ValueError("save_path가 올바르지 않습니다.")
    
    voice_settings={
        "similarity_boost": 1.0,    #명확성 + 유사성
        "stability": 0.4,           #안정 (0 ~ 1 / default : 0.5)
        "style": 0.7,               #스타일 (default : 0)
    }
    output_format="mp3_44100_128"

    #저장 경로 관리
    try:
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
    except OSError as e:
        logging.exception("디렉터리 생성을 실패 하였습니다.")
        return False

    try:
        audio = _apiKey.text_to_speech.convert(
            text = text,
            voice_id = voice_code,
            model_id = "eleven_multilingual_v2",
            voice_settings = voice_settings,
            output_format = output_format,
        )

        audio_bytes = b"".join(audio)
        if not audio_bytes:
            logging.error("오디오 바이트가 비어 있습니다.")
            return False
        
    except Exception as e:
        logging.exception("TTS 생성을 실패 하였습니다.")
        return False

    try:    
        if save_path:
            with open(save_path, "wb") as f:
                f.write(audio_bytes)
    except OSError as e:
        logging.exception("파일 저장을 실패 하였습니다.")
        return False

    return True

