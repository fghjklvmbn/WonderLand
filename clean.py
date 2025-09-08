import os
import platform
import subprocess

def run_command(cmd, cwd=None):
    subprocess.Popen(cmd, cwd=cwd, shell=True)

is_windows = platform.system() == "Windows"

# npm 데이터폴더 삭제
del_cmd = "rmdir /s/q node_modules" if is_windows else "rm -rf node_modules"
run_command(del_cmd, cwd="프론트엔드서버")
run_command("rmdir /s/q janus", cwd="백엔드서버/이미지API")