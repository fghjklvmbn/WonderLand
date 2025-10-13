import os
import sqlite3
from typing import Optional, List, Dict, Any, Tuple
from contextlib import closing

#DB 저장 경로 지정
DB_PATH = "data/tts.db"


def showModels():
    db_connect = sqlite3.connect(DB_PATH)
    db_connect.row_factory = sqlite3.Row
    with closing (db_connect.cursor()) as db_cursor:
        db_cursor.execute("""
            SELECT id, model_name, voice_code, status, created_at
            FROM tts_models
            ORDER BY id DESC
                          """)
        rows = db_cursor.fetchall()
        return [dict(r) for r in rows]

def defaultSetting():
    os.makedirs("data", exist_ok=True)
    db_connect = sqlite3.connect(DB_PATH)
    db_cursor = db_connect.cursor()

    db_cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='tts_models';")
    exists = db_cursor.fetchone()

    if not exists:
        db_cursor.executescript("""
         CREATE TABLE tts_models (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            model_name TEXT NOT NULL UNIQUE,
            voice_code TEXT NOT NULL,
            status TEXT NOT NULL CHECK(status IN ('Done','Process','Fail')),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );                       
        """)
        print("[SQLite] new created  database !")
    else:
        print("[SQLite] complete database !")
    db_connect.commit()
    db_connect.close()

### MODEL CREATE , UPDATE

def createModel(model_name:str, voice_code:str, status:str): #모델 생성, 존재할시 status 변경
    if status not in ("Done", "Process", "Fail"):
        raise ValueError("status 상태가 부적절합니다.")
    with sqlite3.connect(DB_PATH) as db_connect:
        db_connect.execute(
            """
            INSERT INTO tts_models(model_name, voice_code, status) VALUES(?,?,?)
            ON CONFLICT (model_name)
            DO UPDATE SET
                voice_code = excluded.voice_code,
                status = excluded.status
            """,
            (model_name, voice_code, status)
        )

def debug_createModel(model_name:str, voice_code:str, status:str):
    with sqlite3.connect(DB_PATH) as db_connect:
        db_connect.execute(
            """
            INSERT INTO tts_models(model_name, voice_code, status) VALUES(?,?,?)
            ON CONFLICT (model_name)
            DO UPDATE SET
                voice_code = excluded.voice_code,
                status = excluded.status
            """,
            (model_name, voice_code, status)
        )

###  MODEL DELETE

def deleteModel(model_name) -> bool:
    if not model_name:
        raise ValueError("model_name이 비어 있습니다.")

    with sqlite3.connect(DB_PATH) as db_connect:
        db_cursor = db_connect.execute(
            "DELETE FROM tts_models WHERE model_name =?",
            (model_name,),
        )
        return db_cursor.rowcount > 0

def checkModel(model_name:str): #검색된 모델이 없을시 None 반환 있을시 Status 반환
    if not model_name:
        raise ValueError("model_name이 비어 있습니다.")
    
    db_connect = sqlite3.connect(DB_PATH)
    db_connect.row_factory = sqlite3.Row
    with closing(db_connect.cursor()) as db_cursor:
        db_cursor.execute(
            "SELECT status FROM tts_models WHERE model_name = ? LIMIT 1",
            (model_name,),
        )
        row = db_cursor.fetchone()
    db_connect.close()

    if row:
        return row["status"]
    else:
        return None
        