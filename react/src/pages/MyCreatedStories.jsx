import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Row, Col, Card, Modal, Form } from 'react-bootstrap';

const MyCreatedStories = () => {
  const [stories, setStories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);

  // ✅ 현재 로그인된 사용자 ID (임시로 1번)
  const userId = 1;

  useEffect(() => {
    axios.get(`http://localhost:8080/api/stories/mine?userId=${userId}`)
      .then(res => {
        console.log('[DEBUG] 받은 데이터:', res.data);
        setStories(res.data);
      })
      .catch(err => console.error('[ERROR] 내 이야기 불러오기 실패:', err));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      axios.delete(`http://localhost:8080/api/stories/${id}`)
        .then(() => setStories(stories.filter(s => s.storyId !== id)))
        .catch(err => console.error('삭제 실패:', err));
    }
  };

  const handleEdit = (story) => {
    setSelectedStory(story);
    setShowModal(true);
  };

  const handleSave = () => {
    if (!selectedStory) return;
    axios.put(`http://localhost:8080/api/stories/${selectedStory.storyId}`, selectedStory)
      .then(() => setShowModal(false))
      .catch(err => console.error('수정 실패:', err));
  };

  return (
    <>
      <Row className="row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {stories.map((story) => (
          <Col key={story.storyId}>
            <Card>
              <Card.Img variant="top" src={story.thumbnail || 'https://placehold.co/200x200'} />
              <Card.Body>
                <Card.Title>{story.title}</Card.Title>
                <Card.Text className="text-muted">{story.genre}</Card.Text>
                <div className="d-flex gap-2">
                  <Button variant="outline-primary" size="sm">이어 작성</Button>
                  <Button variant="outline-secondary" size="sm" onClick={() => handleEdit(story)}>수정</Button>
                  <Button variant="outline-danger" size="sm" onClick={() => handleDelete(story.storyId)}>삭제</Button>
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
                value={selectedStory?.title || ''}
                onChange={(e) => setSelectedStory(prev => ({ ...prev, title: e.target.value }))}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>장르</Form.Label>
              <Form.Control
                type="text"
                value={selectedStory?.genre || ''}
                onChange={(e) => setSelectedStory(prev => ({ ...prev, genre: e.target.value }))}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>취소</Button>
          <Button variant="primary" onClick={handleSave}>저장</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MyCreatedStories;
