<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import {
  Tabs,
  Tab,
  Container,
  Row,
  Col,
  Button,
  Card,
  Modal,
  Form,
} from 'react-bootstrap';
import axios from 'axios';

// 최근 본 이야기 탭 컴포넌트 (임시 구현)
const RecentStories = () => (
  <Row className="row-cols-2 row-cols-md-3 row-cols-lg-5 g-4">
    {Array(3)
      .fill(0)
      .map((_, i) => (
        <Col key={i}>
          <div className="text-center small">
            <img
              src="https://placehold.co/200x200"
              className="img-fluid rounded mb-2"
              alt="story preview"
            />
            <div>제목</div>
            <div className="text-muted">작가이름</div>
            <div>
              <i className="fas fa-star text-warning"></i> 좋아요 수
            </div>
          </div>
        </Col>
      ))}
  </Row>
);

// 생성한 이야기 탭 컴포넌트 (실제 연동)
const MyCreatedStories = () => {
  const [stories, setStories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editGenre, setEditGenre] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/user/stories')
      .then((res) => setStories(res.data))
      .catch((err) => console.error('이야기 불러오기 실패:', err));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      axios
        .delete(`http://localhost:8080/api/stories/${id}`)
        .then(() => setStories(stories.filter((s) => s.storyId !== id)))
        .catch((err) => console.error('삭제 실패:', err));
    }
  };

  const handleEdit = (story) => {
    setSelectedStory(story);
    setEditTitle(story.title);
    setEditGenre(story.genre);
    setShowModal(true);
  };

  const handleSave = () => {
    axios
      .put(`http://localhost:8080/api/stories/${selectedStory.storyId}`, {
        title: editTitle,
        genre: editGenre,
      })
      .then(() => {
        setStories(
          stories.map((s) =>
            s.storyId === selectedStory.storyId
              ? { ...s, title: editTitle, genre: editGenre }
              : s
          )
        );
        setShowModal(false);
      })
      .catch((err) => console.error('수정 실패:', err));
  };

  return (
    <>
      <Row className="row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {stories.map((story) => (
          <Col key={story.storyId}>
            <Card>
              <Card.Img
                variant="top"
                src={story.thumbnail || 'https://placehold.co/200x200'}
              />
              <Card.Body>
                <Card.Title>{story.title}</Card.Title>
                <Card.Text className="text-muted">{story.genre}</Card.Text>
                <div className="d-flex gap-2">
                  <Button variant="outline-primary" size="sm">
                    이어 작성
                  </Button>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => handleEdit(story)}
                  >
                    수정
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(story.storyId)}
                  >
                    삭제
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>이야기 수정</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>이야기 제목</Form.Label>
              <Form.Control
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>장르</Form.Label>
              <Form.Control
                type="text"
                value={editGenre}
                onChange={(e) => setEditGenre(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            취소
          </Button>
          <Button variant="primary" onClick={handleSave}>
            저장
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const VoiceTraining = () => {
  const [file, setFile] = useState(null);
  const [uploaded, setUploaded] = useState(false);

  const handleUpload = () => {
    if (!file) return alert('파일을 선택하세요');
    setUploaded(true);
    setTimeout(() => alert('학습이 완료되었습니다!'), 1000);
  };

  return (
    <div>
      <Form.Label htmlFor="voiceUpload">
        텍스트 읽기 음성 파일 업로드
      </Form.Label>
      <Form.Control
        type="file"
        id="voiceUpload"
        className="mb-3"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <Button variant="success" onClick={handleUpload}>
        학습 시작
      </Button>
      {uploaded && (
        <div className="mt-2 text-muted small">
          * 학습 완료 시 TTS에 사용 가능
        </div>
      )}
    </div>
  );
};
=======
// src/pages/MyLibrary/MyLibraryTabs.jsx
import React from 'react';
import { Tabs, Tab, Container } from 'react-bootstrap';
import MyAccount from './MyAccount';
>>>>>>> 87bc8f2bd38ad2019e380b036d1b1e951274239e

const MyLibraryTabs = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Container className="py-4 flex-grow-1">
        <h2 className="fw-bold mb-4">내 서재</h2>
        <Tabs defaultActiveKey="recent" id="mylibrary-tabs" className="mb-3">
          <Tab eventKey="account" title="👤 내 계정 설정">
            <MyAccount />
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
};

export default MyLibraryTabs;
