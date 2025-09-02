import os
import platform
import subprocess

def run_command(cmd, cwd=None):
    subprocess.Popen(cmd, cwd=cwd, shell=True).wait()

is_windows = platform.system() == "Windows"

# 설치
run_command("npm install", cwd="프론트엔드서버")
run_command("pip install -r requirements.txt")
run_command("pip install -e .[gradio]", cwd="백엔드서버/이미지API/models/Janus-main")