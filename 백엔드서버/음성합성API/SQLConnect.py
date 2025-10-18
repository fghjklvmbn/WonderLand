import os
import pymysql
from typing import Optional, List, Dict, Any
from contextlib import closing

# =====================================================
# ✅ MySQL 서버 설정 (.env 환경변수 기반)
# =====================================================
def get_db_config() -> Dict[str, Any]:
    """환경 변수에서 DB 설정을 읽어옴. None일 경우 예외 발생 방지."""
    try:
        return {
            "host": os.getenv("DBHost", "localhost"),
            "port": int(os.getenv("DBPort", "3306")),
            "user": os.getenv("DBUser", "root"),
            "password": os.getenv("DBPassword", ""),
            "database": os.getenv("DBDatabase", "tts_system"),
            "charset": os.getenv("DBCharset", "utf8mb4"),
            "cursorclass": pymysql.cursors.DictCursor
        }
    except ValueError as e:
        raise RuntimeError(f"[Config Error] DBPort must be an integer: {e}")


# =====================================================
# ✅ DB 연결 헬퍼
# =====================================================
def get_connection():
    config = get_db_config()
    try:
        return pymysql.connect(**config)
    except Exception as e:
        raise ConnectionError(f"[DB Connection Failed] {e}")


# =====================================================
# ✅ 테이블 초기 설정
# =====================================================
def defaultSetting():
    try:
        with get_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS tts_models (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        model_name VARCHAR(255) NOT NULL UNIQUE,
                        voice_code VARCHAR(255) NOT NULL,
                        status ENUM('Done','Process','Fail') NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
                """)
            conn.commit()
        print("[MySQL] ✅ tts_models table ready.")
    except Exception as e:
        print(f"[MySQL] ❌ Error initializing table: {e}")


# =====================================================
# ✅ 모델 목록 조회
# =====================================================
def showModels() -> List[Dict[str, Any]]:
    try:
        with get_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute("""
                    SELECT id, model_name, voice_code, status, created_at
                    FROM tts_models
                    ORDER BY id DESC;
                """)
                return cursor.fetchall()
    except Exception as e:
        print(f"[MySQL] ❌ showModels error: {e}")
        return []


# =====================================================
# ✅ 모델 생성 / 갱신
# =====================================================
def createModel(model_name: str, voice_code: str, status: str):
    if status not in ("Done", "Process", "Fail"):
        raise ValueError("status 상태가 부적절합니다. ('Done', 'Process', 'Fail' 중 하나)")

    try:
        with get_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO tts_models (model_name, voice_code, status)
                    VALUES (%s, %s, %s)
                    ON DUPLICATE KEY UPDATE
                        voice_code = VALUES(voice_code),
                        status = VALUES(status);
                """, (model_name, voice_code, status))
            conn.commit()
        print(f"[MySQL] ✅ Model '{model_name}' created/updated ({status})")
    except Exception as e:
        print(f"[MySQL] ❌ createModel error: {e}")


def debug_createModel(model_name: str, voice_code: str, status: str):
    """디버깅용 동일 동작"""
    createModel(model_name, voice_code, status)


# =====================================================
# ✅ 모델 삭제
# =====================================================
def deleteModel(model_name: str) -> bool:
    if not model_name:
        raise ValueError("model_name이 비어 있습니다.")

    try:
        with get_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute("DELETE FROM tts_models WHERE model_name = %s;", (model_name,))
                deleted = cursor.rowcount > 0
            conn.commit()
        if deleted:
            print(f"[MySQL] 🗑️ Model '{model_name}' deleted.")
        else:
            print(f"[MySQL] ⚠️ Model '{model_name}' not found.")
        return deleted
    except Exception as e:
        print(f"[MySQL] ❌ deleteModel error: {e}")
        return False


# =====================================================
# ✅ 모델 상태 확인
# =====================================================
def checkModel(model_name: str) -> Optional[str]:
    if not model_name:
        raise ValueError("model_name이 비어 있습니다.")

    try:
        with get_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(
                    "SELECT status FROM tts_models WHERE model_name = %s LIMIT 1;", (model_name,)
                )
                row = cursor.fetchone()
                return row["status"] if row else None
    except Exception as e:
        print(f"[MySQL] ❌ checkModel error: {e}")
        return None