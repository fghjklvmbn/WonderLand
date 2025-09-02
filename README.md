# WonderLand

## 사전 환경
0. 64기가 이상 저장공간 소요
1. node.js 설치
2. Microsoft C++ Build Tools 설치(C++환경)
3. anaconda 설치후 가상환경 조성(anaconda prompt를 이용해서 진행, python 3.10버전, 테스트 완료)
4. 램 32GB 혹은 그래픽 램 12GB 이상 필요

## 통합 설치
일반버전 : python install.py
<br>
엔비디아 버전 : python install_cuda.py

## 통합 실행
python run.py

## node_modules 삭제
python clean.py

## 각 서버별 구체적인 실행 방법
## 백엔드 서버
cd 백엔드서버/프론트내부API
<br>
./mvnw spring-boot:run
<br><br>

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
7860번 포트 : 이미지 생성 화면
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