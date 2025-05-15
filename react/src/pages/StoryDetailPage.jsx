import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Button, Row, Col } from 'react-bootstrap';

const StoryDetailPage = () => {
  const { id } = useParams();
  const [storyPages, setStoryPages] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);

  // 이야기 데이터를 백엔드에서 가져옴
  useEffect(() => {
    axios.get(`http://localhost:8080/api/stories/${id}`)
      .then(res => {
        const pages = res.data.pages || [];
        setStoryPages(pages);
      })
      .catch(err => {
        console.error('이야기 불러오기 실패:', err);
      });
  }, [id]);

  if (storyPages.length === 0) return <div className="text-center mt-5">Loading...</div>;

  const current = storyPages[pageIndex];

  const playTTS = () => {
    const audio = new Audio(current.tts_url);
    audio.play();
  };

  const nextPage = () => {
    if (pageIndex < storyPages.length - 1) setPageIndex(pageIndex + 1);
  };

  const prevPage = () => {
    if (pageIndex > 0) setPageIndex(pageIndex - 1);
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
        <Col md={6} className="d-flex justify-content-center align-items-center">
          <img
            src={current.image_url}
            alt={`page-${pageIndex + 1}`}
            className="img-fluid rounded"
            style={{ maxHeight: '100%', objectFit: 'contain' }}
          />
        </Col>

        <Col md={6} className="d-flex flex-column justify-content-center">
          <div style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>{current.text}</div>
        </Col>
      </Row>

      <div className="text-center my-3">
        <Button variant="secondary" onClick={prevPage} disabled={pageIndex === 0}>
          ◀ 이전
        </Button>{' '}
        <span className="mx-3">
          Page {pageIndex + 1} / {storyPages.length}
        </span>
        <Button
          variant="secondary"
          onClick={nextPage}
          disabled={pageIndex === storyPages.length - 1}
        >
          다음 ▶
        </Button>
      </div>

      <Button
        variant="primary"
        onClick={playTTS}
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
    </main>
  );
};

export default StoryDetailPage;
