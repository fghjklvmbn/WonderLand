import os
import platform
import subprocess

def run_command(cmd, cwd=None):
    subprocess.Popen(cmd, cwd=cwd, shell=True)

is_windows = platform.system() == "Windows"

# AI 서버 실행
run_command("python run.py", cwd="백엔드서버/AI서버API")

# 음성합성 서버 실행
# TODO 파일 통합 예정
#run_command("python run.py", cwd="백엔드서버/음성합성API")

# 이미지 서버 실행
run_command("python app_januspro.py", cwd="백엔드서버/이미지API/models/Janus-main/demo/")
run_command("python app.py", cwd="백엔드서버/이미지API")

# Spring Boot 실행
spring_cmd = "mvnw.cmd spring-boot:run" if is_windows else "./mvnw spring-boot:run"
run_command(spring_cmd, cwd="백엔드서버/프론트내부API")

# 프론트 실행
run_command("npm start", cwd="프론트엔드서버")