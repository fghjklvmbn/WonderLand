import os
import platform
import subprocess
import shutil

def run_command(cmd, cwd=None):
    subprocess.run(cmd, cwd=cwd, shell=True, check=True)

is_windows = platform.system() == "Windows"

# 설치 경로
temp_dir = "Janus-main"
git_url = "https://github.com/deepseek-ai/Janus.git"   # 예시, 실제 경로 확인 필요

# janus 폴더 경로
janus_src = os.path.join(temp_dir, "janus")
janus_dst = os.path.join(os.getcwd(), "백엔드서버\이미지API\janus")

# 프론트엔드 설치
run_command("npm install", cwd="프론트엔드서버")

# 백엔드 설치
run_command("pip install -r requirements.txt")

# janus-pro GitHub에서 clone
print(">>> Janus 다운로드 중...")
run_command(f"git clone {git_url} {temp_dir}")

# janus-pro 설치
print(">>> Janus-Pro 설치 중...")
run_command("pip install -e .", cwd=temp_dir)

# 기존 janus 폴더 있으면 삭제
if os.path.exists(janus_dst):
    print(">>> 기존 janus 폴더 삭제...")
    shutil.rmtree(janus_dst)

# janus 폴더를 상위 폴더로 이동
print(">>> janus 폴더 이동 중...")
shutil.move(janus_src, janus_dst)

# 설치 후 삭제
print(">>> Janus-Pro 임시 디렉토리 삭제 중...")
shutil.rmtree(temp_dir, ignore_errors=True)
run_command("rmdir /s/q Janus-main")

run_command("pip uninstall -y torch torchvision")
run_command("pip install torch torchvision --index-url https://download.pytorch.org/whl/cu126")

print(">>> 모든 설치 완료!")