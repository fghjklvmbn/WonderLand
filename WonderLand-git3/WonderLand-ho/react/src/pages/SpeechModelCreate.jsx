import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, ListGroup } from 'react-bootstrap';
import { Speech, FileAudio } from 'lucide-react'; // 아이콘 (lucide-react 설치 필요)
import axios from 'axios'; // API 요청을 위한 axios
//import CreateVoiceModel from './CreateRecodeModel'; // CreateVoiceModel 컴포넌트
//import SpeechModelCreate from './SpeechModelCreate'



const CreateVoice = () => {
  const navigate = useNavigate();
  const [voiceModels, setVoiceModels] = useState([]);
  const [userId, setUserId] = useState(null);

    const fetchVoiceModels = async () => {
    try {
      // 1. 모델 목록을 API에서 받아옴
      const response = await axios.get('http://localhost:5000/api/model/show');
      const models = response.data.models;  // ["Kakao", "Kakao2"] 형식
      console.log("Models from server:", models);

      // 2. 사용자 ID와 일치하는 모델만 필터링
      if (userId) {
        console.log(userId);
        // 2.1 데이터베이스에서 해당 userId에 해당하는 모델 이름만 가져옴
        //const filteredModels = await axios.get(`http://localhost:8080/api/tts-model/${userId}`);
        const filteredModels = await axios.get(`http://localhost:8080/api/tts-model/1`);
        const userModels = filteredModels.data || [];
        console.log("filteredModels :", filteredModels);
        // 2.2 userModels와 API로 받은 models를 비교하여, 일치하는 모델만 출력
        const validModels = models.filter(model => userModels.includes(model));
        console.log("Models:", models); // 전체 모델 목록 출력
        console.log("User Models:", userModels); // 사용자 모델 목록 출력
        console.log("Filtered Models:", validModels); // 필터링된 모델 목록 출력

        const modelsWithStatus = await Promise.all(validModels.map(async (model) => {
        const status = await fetchModelStatus(model); // 상태를 비동기로 가져옴
        return { modelName: model, status }; // 상태와 모델 이름을 객체로 반환
      }));

        setVoiceModels(modelsWithStatus);
      }
    } catch (error) {
      console.error("모델 목록 불러오기 실패:", error);
    }
  };

  // 사용자 ID 불러오기
  const fetchUserId = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/users/me', { withCredentials: true });
      const fetchedUserId = response.data.userId;
      setUserId(fetchedUserId);  // userId 저장
    } catch (error) {
      console.error("사용자 정보 불러오기 실패:", error);
    }
  };
  const fetchModelStatus = async (modelName) => {
  try {
    // 모델 이름을 query string으로 전달하는 GET 요청
    const response = await axios.get(`http://localhost:5000/api/model/check`, {
      params: { dataset_name: modelName }  // GET 방식에서는 params로 데이터를 보냅니다.
    });
    return response.data.status; // 모델 상태를 반환
  } catch (error) {
    console.error("모델 상태를 가져오는 데 실패했습니다:", error);
    return '상태 불러오기 실패'; // 에러 발생 시 기본 상태 반환
  }
};
  // userId가 변경될 때마다 음성 모델 목록을 다시 불러오기
  useEffect(() => {
    fetchUserId();  // 로그인한 사용자 정보 가져오기
  }, []);

  useEffect(() => {
    if (userId) {
      fetchVoiceModels();  // 사용자 ID가 설정되면 모델 목록 불러오기
    }
  }, [userId]);  // userId가 변경될 때마다 fetchVoiceModels 실행

  return (
    <main
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: '50vh' }}
    >
      <Container>
        <Row className="justify-content-center mt-4">
          {/* 녹음하기 카드 */}
          <Col xs={12} md={5} className="mb-4">
            <Card className="text-center shadow-sm p-3">
              <div
                className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  backgroundColor: '#cce5ff',
                }}
              >
                <Speech size={36} color="#007bff" />
              </div>
              <h5 className="fw-bold">직접 녹음하기</h5>
              <p className="text-muted mb-3">
                제공되는 글을 읽으며 직접 목소리를 녹음해요.
                <br />
                10분에서 15분 정도 시간이 소요돼요.
              </p>
              <Button
                variant="outline-primary"
                onClick={() => navigate('/write_manual')}
              >
                시작하기
              </Button>
            </Card>
          </Col>
          {/* 음성 파일 넣기 카드 */}
          <Col xs={12} md={5} className="mb-4">
            <Card className="text-center shadow-sm p-3">
              <div
                className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  backgroundColor: '#cce5ff',
                }}
              >
                <FileAudio size={36} color="#007bff" />
              </div>
              <h5 className="fw-bold">음성 파일 넣기</h5>
              <p className="text-muted mb-3">
                녹음된 음성 파일을 넣어요.
                <br />
                여러 음성을 합쳐 긴 음성 파일을 만들 수 있어요.
              </p>
              <Button variant="primary" onClick={() => navigate('/createRecodeModel')}>
                시작하기
              </Button>
            </Card>
          </Col>
        </Row>

        {/* 음성 모델 목록 */}
        <Row className="justify-content-center mt-4">
          <Col xs={12} md={10}>
            <h4 className="fw-bold mb-3">내 음성 모델 목록</h4>
            <ListGroup>
              {voiceModels.map((model, index) => (
                <ListGroup.Item
                  key={index}
                  className="d-flex justify-content-between align-items-center shadow-sm mb-3"
                >
                  <div>
                    <strong>{model.modelName}</strong>
                     <p className="text-muted mb-0">상태 : {model.status}</p>
                  </div>
                  <Button
                    variant="outline-primary"
                    onClick={() => {
                      // 모델 선택 시 로직 추가
                      alert(`모델 ${model.modelName}을 선택했습니다.`);
                    }}
                  >
                    삭제하기
                  </Button>
                </ListGroup.Item>
              ))}
              {/* 음성 모델이 없을 경우 */}
              {voiceModels.length === 0 && (
                <ListGroup.Item className="text-center">
                  등록된 음성 모델이 없습니다.
                </ListGroup.Item>
              )}
            </ListGroup>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default CreateVoice;
