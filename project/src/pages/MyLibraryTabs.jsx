import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import { Tabs, Tab, Container, Row, Col, Button, Card, Modal, Form } from 'react-bootstrap';

// 최근 본 이야기 탭 컴포넌트
const RecentStories = () => (
  <Row className="row-cols-2 row-cols-md-3 row-cols-lg-5 g-4">
    {Array(3).fill(0).map((_, i) => (
      <Col key={i}>
        <div className="text-center small">
          <img src="https://placehold.co/200x200" className="img-fluid rounded mb-2" alt="story preview" />
          <div>제목</div>
          <div className="text-muted">작가이름</div>
          <div><i className="fas fa-star text-warning"></i> 좋아요 수</div>
        </div>
      </Col>
    ))}
  </Row>
);

// 생성한 이야기 탭 컴포넌트
const MyCreatedStories = () => {
  // 기본 이야기 목록 상태
  const [stories, setStories] = useState([
    { id: 1, title: '용감한 꼬마', genre: '모험 / 동화' },
    { id: 2, title: '마법의 호수', genre: '판타지 / 연령 8~13세' },
    { id: 3, title: '우주 탐험대', genre: 'SF / 13세 이상' },
  ]);

  // 수정 모달 상태
  const [showModal, setShowModal] = useState(false);

  // 선택된 수정 대상 이야기
  const [selectedStory, setSelectedStory] = useState(null);

  // 삭제 처리 함수
  const handleDelete = (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      setStories(stories.filter(s => s.id !== id));
    }
  };

  // 수정 버튼 클릭 시 모달 열기
  const handleEdit = (story) => {
    setSelectedStory(story);
    setShowModal(true);
  };

  return (
    <>
      {/* 카드 형식의 이야기 목록 출력 */}
      <Row className="row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {stories.map((story) => (
          <Col key={story.id}>
            <Card>
              <Card.Img variant="top" src="https://placehold.co/400x200" />
              <Card.Body>
                <Card.Title>{story.title}</Card.Title>
                <Card.Text className="text-muted">{story.genre}</Card.Text>
                <div className="d-flex gap-2">
                  <Button variant="outline-primary" size="sm">이어 작성</Button>
                  <Button variant="outline-secondary" size="sm" onClick={() => handleEdit(story)}>수정</Button>
                  <Button variant="outline-danger" size="sm" onClick={() => handleDelete(story.id)}>삭제</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 이야기 수정용 모달 */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>이야기 수정</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>이야기 제목</Form.Label>
              <Form.Control type="text" defaultValue={selectedStory?.title} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>장르</Form.Label>
              <Form.Control type="text" defaultValue={selectedStory?.genre} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>취소</Button>
          <Button variant="primary">저장</Button> {/* 실제 저장 기능은 아직 구현 안됨 */}
        </Modal.Footer>
      </Modal>
    </>
  );
};

// 내 목소리 학습 탭 컴포넌트
const VoiceTraining = () => {
  const [file, setFile] = useState(null); // 업로드된 파일
  const [uploaded, setUploaded] = useState(false); // 업로드 상태

  // 업로드 버튼 클릭 시 처리
  const handleUpload = () => {
    if (!file) return alert('파일을 선택하세요');
    setUploaded(true);
    setTimeout(() => alert('학습이 완료되었습니다!'), 1000); // 모의 학습 처리
  };

  return (
    <div>
      <Form.Label htmlFor="voiceUpload">텍스트 읽기 음성 파일 업로드</Form.Label>
      <Form.Control type="file" id="voiceUpload" className="mb-3" onChange={(e) => setFile(e.target.files[0])} />
      <Button variant="success" onClick={handleUpload}>학습 시작</Button>
      {uploaded && <div className="mt-2 text-muted small">* 학습 완료 시 TTS에 사용 가능</div>}
    </div>
  );
};

// 내 서재 탭 전체 페이지
const MyLibraryTabs = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Container className="py-4 flex-grow-1">
        <h2 className="fw-bold mb-4">내 서재</h2>
        {/* 탭 메뉴 */}
        <Tabs defaultActiveKey="recent" id="mylibrary-tabs" className="mb-3">
          <Tab eventKey="recent" title="📖 최근 본 이야기">
            <RecentStories />
          </Tab>
          <Tab eventKey="created" title="✍️ 생성한 이야기">
            <MyCreatedStories />
          </Tab>
          <Tab eventKey="voice" title="🔊 내 목소리 학습">
            <VoiceTraining />
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
};

export default MyLibraryTabs;
