import React, { useState } from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';

const categories = [
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

const CategorySelector = ({ selected, onSelect, onGenerate }) => {
  const toggleCategory = (category) => {
    if (selected.includes(category)) {
      onSelect(selected.filter((c) => c !== category));
    } else {
      onSelect([...selected, category]);
    }
  };

  return (
    <Container className="py-4 text-center" style={{ maxWidth: '700px' }}>
      <h4 className="fw-bold mb-2">카테고리 선택</h4>
      <p className="text-muted mb-4">원하는 카테고리를 선택하세요.</p>

      <div
        className="p-4 mb-4 mx-auto shadow-sm rounded"
        style={{ background: '#f9f9f9' }}
      >
        <Row className="g-2 justify-content-center">
          {categories.map((category) => (
            <Col key={category} xs="auto">
              <Button
                variant={
                  selected.includes(category) ? 'primary' : 'outline-primary'
                }
                onClick={() => toggleCategory(category)}
                className="rounded-pill px-3"
              >
                {category}
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

export default CategorySelector;
