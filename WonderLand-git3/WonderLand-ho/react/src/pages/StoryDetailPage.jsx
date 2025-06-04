import React, { useEffect, useState, useRef} from 'react';

import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Button, Row, Col, Modal, ListGroup, Spinner } from 'react-bootstrap';

const StoryDetailPage = () => {
  const { id } = useParams();
  const [storyPages, setStoryPages] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [storyTitle, setStoryTitle] = useState('');
  const [selectedImages, setSelectedImages] = useState({});
  const [voiceModels, setVoiceModels] = useState([]);
  const [userId, setUserId] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [modelId, setModelId] = useState(null);  // 모델 ID 상태

  const audioRef = useRef(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/stories/${id}`)
      .then((res) => {
        const pages = res.data.pages || [];
        setStoryPages(pages);
        if (res.data.title) setStoryTitle(res.data.title);
        if (res.data.selected_json) setSelectedImages(res.data.selected_json);
      })
      .catch((err) => {
        console.error('이야기 불러오기 실패:', err);
      });
    // 사용자 ID 불러오기
    fetchUserId();

    //종료
    return () => {
      const currentAudio = audioRef.current;
      if (audioRef.current) {
        audioRef.current.pause();  // 음성 중지
        audioRef.current.currentTime = 0;  // 음성 초기화
      }
    }
  }, [id]);

  // 사용자 ID 불러오기
  const fetchUserId = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/users/me', { withCredentials: true });
      const fetchedUserId = response.data.userId;
      setUserId(fetchedUserId);
      fetchVoiceModels(fetchedUserId);  // 사용자 ID를 기반으로 음성 모델 목록 불러오기
    } catch (error) {
      console.error("사용자 정보 불러오기 실패:", error);
    }
  };

  const fetchVoiceModels = async (userId) => {
    try {
      // 모델 목록을 API에서 받아옴
      const response = await axios.get('http://localhost:5000/api/model/show');
      const models = response.data.models;

      if (userId) {
        // 사용자 ID와 일치하는 모델만 필터링
        const filteredModels = await axios.get(`http://localhost:8080/api/tts-model/${userId}`);
        const userModels = filteredModels.data || [];
        // userModels와 API로 받은 models를 비교하여, 일치하는 모델만 출력
        const validModels = models.filter(model => userModels.includes(model));

        // 상태가 "Done"인 모델만 필터링
        const modelsWithStatus = await Promise.all(validModels.map(async (model) => {
          const status = await fetchModelStatus(model);
          return { modelName: model, status, id: model }; // 상태와 모델 이름을 객체로 반환
        }));

        // 상태가 "Done"인 모델만 상태로 저장
        const doneModels = modelsWithStatus.filter(model => model.status === 'Done');
        setVoiceModels(doneModels);
      }
      setIsLoading(false);  // 로딩 완료
    } catch (error) {
      console.error("모델 목록 불러오기 실패:", error);
      setIsLoading(false);
    }
  };

  // 모델 상태 가져오는 함수
  const fetchModelStatus = async (modelName) => {
    try {
      const response = await axios.get('http://localhost:5000/api/model/check', {
        params: { dataset_name: modelName }
      });
      return response.data.status;  // 모델 상태 반환
    } catch (error) {
      console.error("모델 상태를 가져오는 데 실패했습니다:", error);
      return '상태 불러오기 실패';  // 에러 발생 시 기본 상태 반환
    }
  };

  if (storyPages.length === 0)
    return <div className="text-center mt-5">Loading...</div>;

  const coverImageUrl = selectedImages['1'];
  const totalPageCount = storyPages.length + 1;
  const currentPage = pageIndex === 0 ? null : storyPages[pageIndex - 1];

const playTTS = () => {
  if (!selectedModel) {
    console.error('음성 모델을 선택해 주세요.');
    return;
  }

  // 2페이지로 이동 (인덱스 1)
  setPageIndex(1);

  // 음성 재생 함수
  const playAudioForPage = (pageIndex) => {
    setShowModal(false); //모달창 닫기
    if (pageIndex < 1 || pageIndex > 5) return; // 1~5페이지만 음성 파일을 재생하도록 제한

    // 음성 파일 이름 구성 (예: Apple1_1.wav, Apple1_2.wav 등)
    const audioFile = `${selectedModel.modelName}${id}_${pageIndex}.wav`;
    const audioUrl = `http://localhost:5000/api/audio/files/${audioFile}`;
    console.log('음성 파일 URL:', audioUrl);  // 디버깅용

    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    audio.play();

    // 음성 재생이 끝나면 다음 페이지로 이동
    audio.onended = () => {
      if (pageIndex < 5) { // 마지막 페이지(5)까지 음성을 재생
        setPageIndex(pageIndex + 1); // 다음 페이지로 이동
        playAudioForPage(pageIndex + 1); // 재귀 호출로 다음 페이지 음성 재생
      }
    };
  };

  // 첫 번째 페이지 음성을 시작
  playAudioForPage(1);
};

  const nextPage = () => {
    if (pageIndex < totalPageCount - 1) setPageIndex(pageIndex + 1);
  };

  const prevPage = () => {
    if (pageIndex > 0) setPageIndex(pageIndex - 1);
  };

  const handleModelClick = (model) => {
    setSelectedModel(model);  // 모델 선택
    fetchModelId(model.modelName);  // 해당 모델의 ID를 가져옴
  };

  const fetchModelId = async (modelName) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/tts-model/id/${modelName}`);
      setModelId(response.data);  // 모델 ID 저장
    } catch (error) {
      console.error("모델 ID를 가져오는 데 실패했습니다:", error);
    }
  };

  return (
    <main
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '30px 20px',
      }}
    >
      {pageIndex === 0 ? (
        <Row
          className="shadow border rounded bg-white w-100"
          style={{
            maxWidth: '1300px',
            minHeight: '400px',
            padding: '30px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Col
            md={6}
            className="d-flex justify-content-center align-items-center"
          >
            <img
              src={coverImageUrl}
              alt="cover"
              className="img-fluid rounded"
              style={{ maxHeight: '100%', objectFit: 'contain' }}
            />
          </Col>
          <Col
            md={6}
            className="d-flex justify-content-center align-items-center"
          >
            <h2 style={{ textAlign: 'center', fontWeight: 'bold' }}>
              {storyTitle || '제목 없음'}
            </h2>
          </Col>
        </Row>
      ) : (
        <Row
          className="shadow border rounded bg-white w-100"
          style={{
            maxWidth: '1300px',
            minHeight: '600px',
            padding: '30px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Col
            md={6}
            className="d-flex justify-content-center align-items-center"
          >
            <img
              src={currentPage.image_url}
              alt={`page-${pageIndex}`}
              className="img-fluid rounded"
              style={{ maxHeight: '100%', objectFit: 'contain' }}
            />
          </Col>

          <Col md={6} className="d-flex flex-column justify-content-center">
            <div style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
              {currentPage.text}
            </div>
          </Col>
        </Row>
      )}

      <div className="text-center my-3">
        <Button
          variant="secondary"
          onClick={prevPage}
          disabled={pageIndex === 0}
        >
          ◀ 이전
        </Button>{' '}
        <span className="mx-3">
          Page {pageIndex + 1} / {totalPageCount}
        </span>
        <Button
          variant="secondary"
          onClick={nextPage}
          disabled={pageIndex === totalPageCount - 1}
        >
          다음 ▶
        </Button>
      </div>

      {pageIndex !== 0 && (
        <Button
          variant="primary"
          onClick={() => setShowModal(true)}
          style={{
            position: 'fixed',
            bottom: '80px',
            right: '30px',
            zIndex: 9999,
            borderRadius: '50px',
            padding: '12px 20px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
          }}
        >
          🔊 음성 듣기
        </Button>
      )}

      {/* 음성 모델 선택 모달 */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>음성 모델 선택</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isLoading ? (
            <Spinner animation="border" />
          ) : (
            <ListGroup>
              {voiceModels.map((model) => (
                <ListGroup.Item
                  key={model.modelName}
                  onClick={() => handleModelClick(model)} // 모델 선택
                  style={{
                    cursor: 'pointer',
                    backgroundColor: selectedModel === model ? '#007bff' : 'transparent', // 선택된 모델 파란색으로 표시
                    color: selectedModel === model ? 'white' : 'black', // 텍스트 색상 변경
                  }}
                >
                  {model.modelName} - 상태: {model.status}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            취소
          </Button>
          <Button
            variant="primary"
            onClick={playTTS}
            disabled={!selectedModel} // 모델 선택 전에는 버튼 비활성화
          >
            재생하기
          </Button>
        </Modal.Footer>
      </Modal>
    </main>
  );
};

export default StoryDetailPage;
