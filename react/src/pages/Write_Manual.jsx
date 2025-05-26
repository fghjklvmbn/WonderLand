import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import GenreSelector from './GenreSelector'; // ✅ 이름 변경된 GenreSelector import

const WriteManual = () => {
  const navigate = useNavigate();
  const [texts, setTexts] = useState(['', '', '', '', '']);
  const [title, setTitle] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]); // ✅ 선택된 장르 상태

  const handleChange = (index, value) => {
    const newTexts = [...texts];
    newTexts[index] = value;
    setTexts(newTexts);
  };

  const handleGenerate = () => {
    // 유효성 검사 주석 처리된 상태 유지
    const allEmpty = texts.every((text) => !text.trim());
    if (!title.trim()) {
      alert('이야기 제목을 입력해주세요!');
      return;
    }
    if (allEmpty) {
      alert('최소 한 페이지 이상 작성해주세요!');
      return;
    }
    // if (selectedGenres.length === 0) {
    //   alert('최소 한 개의 장르를 선택해주세요.');
    //   return;
    // }

    navigate('/imagegenerator', {
      state: {
        mode: 'manual', // 모드를 넘겨서 이미지 생성 페이지를 분기 분할하려고 함
        title: title,
        pages: texts,
        genre: selectedGenres,
      },
    });
  };

  return (
    <Container className="py-5" style={{ maxWidth: '700px' }}>
      <h4 className="fw-bold text-center mb-2">
        원하는 스토리를 자유롭게 적어주세요.
      </h4>
      <p className="text-muted text-center mb-4">
        각 페이지별로 작성해보세요. 최대 5페이지까지 가능합니다.
      </p>

      <Form>
        <Form.Group className="mb-4">
          <Form.Label>이야기 제목</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            placeholder="이야기 제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="shadow-sm"
            style={{ resize: 'none', borderRadius: '12px', fontWeight: '500' }}
          />
        </Form.Group>

        {texts.map((text, index) => (
          <Form.Group key={index} className="mb-3">
            <Form.Label>페이지 {index + 1}</Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              placeholder={`페이지 ${index + 1} 내용 입력`}
              value={text}
              onChange={(e) => handleChange(index, e.target.value)}
              className="shadow-sm"
              style={{ resize: 'none', borderRadius: '12px' }}
            />
          </Form.Group>
        ))}
      </Form>

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

      {/* ✅ 장르 선택 영역 */}
      <GenreSelector selected={selectedGenres} onSelect={setSelectedGenres} />

      <div className="text-center">
        <Button
          variant="primary"
          className="px-5 rounded-pill"
          onClick={handleGenerate}
          disabled={selectedGenres.length === 0} // ✅ 선택된 장르가 있어야 활성화
        >
          이미지 생성하기
        </Button>
      </div>
    </Container>
  );
};

export default WriteManual;
