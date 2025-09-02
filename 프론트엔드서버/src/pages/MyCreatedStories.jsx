import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Row, Col, Card, Modal, Form } from 'react-bootstrap';
import GenreSelector from './GenreSelector';
import { useNavigate } from 'react-router-dom';

const MyCreatedStories = () => {
  const [stories, setStories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editGenre, setEditGenre] = useState('');
  const navigate = useNavigate();

  const handleClick = (id) => {
    navigate(`/story/${id}`);
  };
  useEffect(() => {
    axios
      .get('http://localhost:8080/api/stories/mine', { withCredentials: true })
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
  const handleToggleShare = async (storyId, currentShared) => {
    const confirmMessage = currentShared
      ? '정말로 공유를 취소하시겠습니까?'
      : '정말로 이야기를 공유하시겠습니까?';

    if (!window.confirm(confirmMessage)) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/story/${storyId}/toggle-share`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ isShared: !currentShared }),
        }
      );

      if (!response.ok) {
        throw new Error('공유 상태 변경 실패');
      }

      const result = await response.json();

      // ✅ 상태 배열 갱신
      setStories((prevStories) =>
        prevStories.map((story) =>
          story.storyId === storyId
            ? { ...story, isShared: result.isShared }
            : story
        )
      );

      alert(`이야기가 ${result.isShared ? '공유됨' : '비공유 상태로 전환됨'}`);
    } catch (error) {
      alert('공유 상태 변경에 실패했습니다.');
      console.error(error);
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
                onClick={() => handleClick(story.storyId)}
                style={{ cursor: 'pointer' }}
              />
              <Card.Body>
                <Card.Title>{story.title}</Card.Title>
                <Card.Text className="text-muted">{story.genre}</Card.Text>
                <div className="d-flex gap-2">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => navigate(`/continue/${story.storyId}`)}
                  >
                    이어쓰기
                  </Button>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => handleEdit(story)}
                  >
                    수정
                  </Button>
                  <Button
                    variant={story.isShared ? 'secondary' : 'success'}
                    onClick={() =>
                      handleToggleShare(story.storyId, story.isShared)
                    }
                  >
                    {story.isShared ? '공유 취소' : '공유'}
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
        {/* <Modal.Body>
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
        </Modal.Body> */}
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
              <Form.Label>장르 선택</Form.Label>
              <GenreSelector
                selected={editGenre ? [editGenre] : []}
                onSelect={(val) => {
                  if (typeof val === 'string') {
                    setEditGenre(val.trim());
                  }
                }}
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

export default MyCreatedStories;
