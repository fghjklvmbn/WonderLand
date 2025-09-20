import os
import platform
import subprocess

def run_command(cmd, cwd=None):
    subprocess.Popen(cmd, cwd=cwd, shell=True)

is_windows = platform.system() == "Windows"

# npm 데이터폴더 삭제
del_cmd_node = "rmdir /s/q node_modules" if is_windows else "rm -rf node_modules"
run_command(del_cmd_node, cwd="프론트엔드서버")
del_cmd_janus = "rmdir /s/q janus" if is_windows else "rm -rf janus"
run_command(del_cmd_janus, cwd="백엔드서버/이미지API")

spring_cmd = "mvnw.cmd clean" if is_windows else "./mvnw clean"
run_command(spring_cmd, cwd="백엔드서버/프론트내부API")