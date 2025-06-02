import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const My_Story = () => {
  const [storyData, setStoryData] = useState(null);
  const navigate = useNavigate();
  const [isShared, setIsShared] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem('myStoryData');

    if (savedData) {
      const parsed = JSON.parse(savedData);
      setStoryData(parsed);

      // 저장된 스토리의 공유 여부를 상태로 세팅
      if (parsed.isShared !== undefined) {
        setIsShared(parsed.isShared);
      }
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
  const handleToggleShare = async () => {
    const confirmMessage = isShared
      ? '공유를 취소하시겠습니까?'
      : '이야기를 공유하시겠습니까?';

    // 사용자 확인
    if (!window.confirm(confirmMessage)) {
      return; // 취소 시 아무 것도 하지 않음
    }

    try {
      const storyId = localStorage.getItem('latestStoryId');
      const newIsShared = !isShared;

      const response = await fetch(
        `http://localhost:8080/api/story/${storyId}/toggle-share`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ isShared: newIsShared }),
        }
      );

      if (!response.ok) {
        throw new Error('공유 상태 변경 실패');
      }

      const result = await response.json();
      setIsShared(result.isShared);
      alert(`이야기가 ${result.isShared ? '공유됨' : '비공유 상태로 전환됨'}`);
    } catch (error) {
      alert('공유 상태 변경에 실패했습니다.');
      console.error(error);
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
      {/* 이야기 공유/취소 버튼 */}
      <div className="text-center mb-5">
        <Button
          variant={isShared ? 'secondary' : 'success'}
          onClick={handleToggleShare}
        >
          {isShared ? '공유 취소' : '이야기 공유하기'}
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
