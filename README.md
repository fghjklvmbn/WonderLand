# WonderLand

## 사전 환경
 - 64기가 이상 저장공간 소요
 - AI 사용시 램 32GB 혹은 그래픽 램 12GB 이상 필요

## 설치 필요
 - node.js 22 버전 권장
 - Microsoft C++ Build Tools 최신버전
 - anaconda(miniconda로 대체 가능)
 - git 최신버전
 - python 3.10 버전 권장

## 아나콘다 설치 및 활성화 명령어
 - conda create -y --name Wonderland python=3.10
 - conda activate Wonderland

## 통합 설치
일반버전 : python install.py
<br>
엔비디아 버전 : python install_cuda.py

## 통합 실행
python run.py

## 실행파일 삭제
python clean.py

## 각 서버별 구체적인 실행 방법

## AI 서버
cd 백엔드서버/AI서버API
<br>
python run.py
<br><br>

## 음성합성 서버(예정)
cd 백엔드서버/음성합성API
<br>
python run.py
<br><br>

## 이미지 서버
cd 백엔드서버/이미지API
<br>
python app.py
<br><br>

## 개방 포트 번호
5000번 포트 : 이미지 서버
<br>
3000번 포트 : AI 서버
<br>
3001번 포트 : 프론트엔드 서버
<br>
6000번 포트 : 음성 생성 서버
<br><br>
3000번 포트 응답(나머지는 API명세서 참고)

<br>
/ai/StoryCreate : AI 서버 응답

<br><br>
5000번 포트 응답
<br>
/ai/Art : 이미지서버 응답
<br><br>

백엔드 서버
<br>

/ : 백엔드 응답
