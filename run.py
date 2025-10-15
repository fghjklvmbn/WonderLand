import os
import platform
import subprocess
import signal
import sys
import time

processes = []
is_windows = platform.system() == "Windows"

def run_command(cmd, cwd=None):
    """명령어 실행 (로그 출력 연결 포함)"""
    print(f"▶ 실행 중: {cmd} (cwd={cwd})")

    if is_windows:
        # Windows: preexec_fn 지원 안됨 → creationflags 사용
        p = subprocess.Popen(
            cmd,
            cwd=cwd,
            shell=True,
            stdout=sys.stdout,
            stderr=sys.stderr,
            creationflags=subprocess.CREATE_NEW_PROCESS_GROUP
        )
    else:
        # Mac/Linux: preexec_fn=os.setsid로 프로세스 그룹 관리
        p = subprocess.Popen(
            cmd,
            cwd=cwd,
            shell=True,
            stdout=sys.stdout,
            stderr=sys.stderr,
            preexec_fn=os.setsid
        )
    processes.append(p)
    return p

def stop_all():
    """실행된 모든 프로세스 종료"""
    print("\n⏹ 모든 서버 종료 중...")
    for p in processes:
        try:
            if is_windows:
                # Windows: CTRL_BREAK_EVENT로 그룹 종료
                p.send_signal(signal.CTRL_BREAK_EVENT)
            else:
                # Mac/Linux: 프로세스 그룹 종료
                os.killpg(os.getpgid(p.pid), signal.SIGTERM)
        except Exception as e:
            print(f"종료 실패: {e}")

try:
    # AI 서버 실행 포트 3000번
    run_command("python run.py", cwd="백엔드서버/AI서버API")

    # 이미지 서버 실행 포트 5000번
    run_command("python app.py", cwd="백엔드서버/이미지API")

    # 프론트 실행 포트 3001번
    run_command("npm start", cwd="프론트엔드서버")

    # 음성 합성 서버 실행 포트 6000번
    run_command("python APIServer.py", cwd="백엔드서버/음성합성API")

    # 무한 대기 (Ctrl+C 받기)
    while True:
        time.sleep(1)

except KeyboardInterrupt:
    stop_all()