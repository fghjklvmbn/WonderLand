import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const My_Story = () => {
  const [storyData, setStoryData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedData = localStorage.getItem('myStoryData');
    if (savedData) {
      setStoryData(JSON.parse(savedData));
    } else {
      alert('이야기 데이터가 없습니다.');
      navigate('/');
    }
  }, [navigate]);

  // "내 이야기 보러 가기" 버튼 클릭 시
  const handleGoToMyStory = () => {
    const storyId = localStorage.getItem('latestStoryId');
    if (storyId) {
      navigate(`/story/${storyId}`);
    } else {
      alert('최근 생성된 이야기가 없습니다.');
    }
  };

  if (!storyData) {
    return null;
  }

  const { title, genre, pages, selectedImages } = storyData;

  return (
    <Container className="py-5" style={{ maxWidth: '900px' }}>
      <h2 className="fw-bold text-center mb-4">{title}</h2>

      <p className="text-muted text-center mb-4">
        장르: {Array.isArray(genre) ? genre.join(', ') : genre}
      </p>

      {/* 내 이야기 보러 가기 버튼 */}
      <div className="text-center mb-4">
        <Button variant="primary" onClick={handleGoToMyStory}>
          내 이야기 보러 가기
        </Button>
      </div>

      {pages.map((text, idx) => {
        const imageUrl = selectedImages[idx + 1]; // 페이지 번호 1부터 시작
        return (
          <Card key={idx} className="mb-4 p-3 shadow-sm">
            <Row className="align-items-center">
              <Col md={6} className="mb-3 mb-md-0">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={`Page ${idx + 1}`}
                    style={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: '8px',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '200px',
                      backgroundColor: '#eee',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '8px',
                    }}
                  >
                    이미지 없음
                  </div>
                )}
              </Col>
              <Col md={6}>
                <h5 className="fw-bold mb-3">페이지 {idx + 1}</h5>
                <p>{text}</p>
              </Col>
            </Row>
          </Card>
        );
      })}
    </Container>
  );
};

export default My_Story;
