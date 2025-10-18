import os
import platform
import subprocess
import pathlib
import shutil

def run_command(cmd, cwd=None):
    """시스템 명령 실행 (비동기 실행)"""
    subprocess.Popen(cmd, cwd=cwd, shell=True)

def remove_pycache_and_pyc(root="."):
    """__pycache__ 및 .pyc 파일 삭제"""
    count = 0
    for path in pathlib.Path(root).rglob('__pycache__'):
        try:
            shutil.rmtree(path)
            print(f"🧹 Removed: {path}")
            count += 1
        except Exception as e:
            print(f"❌ Failed to remove {path}: {e}")
    for pyc_file in pathlib.Path(root).rglob('*.pyc'):
        try:
            pyc_file.unlink()
            print(f"🗑️ Removed: {pyc_file}")
        except Exception as e:
            print(f"❌ Failed to remove {pyc_file}: {e}")
    print(f"✅ Total cache folders removed: {count}")

# 현재 OS 확인
is_windows = platform.system() == "Windows"
now = os.getcwd()

# 삭제 명령어 설정
del_cmd_node = "rmdir /s/q node_modules" if is_windows else "rm -rf node_modules"
del_cmd_janus = "rmdir /s/q janus" if is_windows else "rm -rf janus"

# 폴더 삭제 실행
print("🧩 Deleting node_modules in 프론트엔드서버 ...")
run_command(del_cmd_node, cwd=os.path.join(now, "프론트엔드서버"))

print("🧩 Deleting janus in 백엔드서버/이미지API ...")
run_command(del_cmd_janus, cwd=os.path.join(now, "백엔드서버", "이미지API"))

# Python 캐시파일 삭제
print("\n🧩 Cleaning Python cache files (.pyc, __pycache__) ...")
remove_pycache_and_pyc(now)

print("\n✨ Clean completed!")