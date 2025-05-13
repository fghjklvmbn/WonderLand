import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import sampleStory from '../data/sampleStory.json';
import { Button, Row, Col } from 'react-bootstrap';

const StoryDetailPage = () => {
  const { id } = useParams();
  const [story, setStory] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);

  useEffect(() => {
    setStory(sampleStory);
  }, [id]);

  if (story.length === 0) return <div>Loading...</div>;
  const current = story[pageIndex];

  const playTTS = () => {
    const audio = new Audio(current.tts_url);
    audio.play();
  };

  const nextPage = () => {
    if (pageIndex < story.length - 1) setPageIndex(pageIndex + 1);
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
        {/* 이미지 */}
        <Col
          md={6}
          className="d-flex justify-content-center align-items-center"
          style={{ height: '100%' }}
        >
          <img
            src={current.image_url}
            alt={`page-${pageIndex + 1}`}
            className="img-fluid rounded"
            style={{ maxHeight: '100%', objectFit: 'contain' }}
          />
        </Col>

        {/* 텍스트 */}
        <Col
          md={6}
          className="d-flex flex-column justify-content-center"
          style={{ height: '100%' }}
        >
          <div style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
            {current.text}
          </div>
        </Col>
      </Row>

      <div className="text-center my-3">
        <Button
          variant="secondary"
          onClick={prevPage}
          disabled={pageIndex === 0}
        >
          ◀ 이전
        </Button>{' '}
        <span className="mx-3">
          Page {pageIndex + 1} / {story.length}
        </span>
        <Button
          variant="secondary"
          onClick={nextPage}
          disabled={pageIndex === story.length - 1}
        >
          다음 ▶
        </Button>
      </div>

      {/* 음성 듣기 버튼 */}
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
