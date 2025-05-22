import React from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';

const genres = [
  '모험',
  '동물',
  '사랑',
  '우정',
  '가족',
  '식물',
  '교육',
  '곤충',
  '액션',
  '로봇',
  '판타지',
  '무협',
  '역사',
  '운동',
  '예술',
  '게임',
  '장래',
  '미래',
  '과거',
  '사이다',
  '교훈',
  '괴물',
  '친구',
  '자연',
  '들',
  '산',
  '바다',
  '우주',
];

const GenreSelector = ({ selected, onSelect, onGenerate }) => {
  const toggleGenre = (genre) => {
    if (selected.includes(genre)) {
      onSelect(selected.filter((g) => g !== genre));
    } else {
      onSelect([...selected, genre]);
    }
  };

  return (
    <Container className="py-4 text-center" style={{ maxWidth: '700px' }}>
      <h4 className="fw-bold mb-2">장르 선택</h4>
      <p className="text-muted mb-4">원하는 장르를 선택하세요.</p>

      <div
        className="p-4 mb-4 mx-auto shadow-sm rounded"
        style={{ background: '#f9f9f9' }}
      >
        <Row className="g-2 justify-content-center">
          {genres.map((genre) => (
            <Col key={genre} xs="auto">
              <Button
                variant={
                  selected.includes(genre) ? 'primary' : 'outline-primary'
                }
                onClick={() => toggleGenre(genre)}
                className="rounded-pill px-3"
              >
                {genre}
              </Button>
            </Col>
          ))}
        </Row>
      </div>

      {onGenerate && (
        <Button
          variant="primary"
          className="px-5 rounded-pill"
          onClick={onGenerate}
        >
          줄거리 생성하기
        </Button>
      )}
    </Container>
  );
};

export default GenreSelector;
