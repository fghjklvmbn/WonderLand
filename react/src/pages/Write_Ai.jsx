import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import GenreSelector from './GenreSelector'; // ✅ 장르 컴포넌트 import

const Write_Ai = () => {
  const [text, setText] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]); // ✅ 선택된 장르 상태

  const handleGenerate = () => {
    if (!text.trim()) {
      alert('내용을 입력해주세요!');
      return;
    }

    if (selectedGenres.length === 0) {
      alert('장르를 하나 이상 선택해주세요!');
      return;
    }

    // 추후 줄거리 생성 로직 추가
    console.log('입력된 내용:', text);
    console.log('선택된 장르:', selectedGenres);
  };

  return (
    <Container className="py-5" style={{ maxWidth: '700px' }}>
      <h4 className="fw-bold text-center mb-2">
        원하는 스토리를 자유롭게 적어주세요.
      </h4>
      <p className="text-muted text-center mb-4">
        작은 내용을 토대로 줄거리를 만들어드려요.
      </p>

      <Form>
        <Form.Control
          as="textarea"
          rows={8}
          placeholder="이곳에 작성하기"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="mb-3 shadow-sm"
          style={{ resize: 'none', borderRadius: '12px' }}
        />
      </Form>

      {/* ✅ 장르 선택 영역 */}
      <GenreSelector selected={selectedGenres} onSelect={setSelectedGenres} />

      <div className="text-center text-muted small mb-4">
        <div>
          예시 1) 소포아가 신비로운 마법의 숲을 탐험하며 친구들과 함께 숲을
          지켜내는 이야기
        </div>
        <div>
          예시 2) 등장인물: 빨간머리 앤 &nbsp; 줄거리: 앤이 친구 줄리아와 함께
          숲으로 놀러간다.
        </div>
        <div>
          예시 3) 권선징악을 주제로 하고 주인공은 고양이가 나쁜 악당을
          무찔렀으면 좋겠어
        </div>
      </div>

      <div className="text-center">
        <Button
          variant="primary"
          className="px-5 rounded-pill"
          onClick={handleGenerate}
        >
          줄거리 생성하기
        </Button>
      </div>
    </Container>
  );
};

export default Write_Ai;
