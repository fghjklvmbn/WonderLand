import React, { useState } from 'react';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import GenreSelector from './GenreSelector';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Write_Ai = () => {
  const [text, setText] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [loading, setLoading] = useState(false);   // 진행 상태 표시용
  const [message, setMessage] = useState('');      // 메시지 관리
  const navigate = useNavigate();


  const handleGenerate = async () => {
    if (!text.trim()) {
      alert('내용을 입력해주세요!');
      return;
    }
    if (selectedGenres.length === 0) {
      alert('장르를 하나 이상 선택해주세요!');
      return;
    }

    try {
      setMessage('스토리를 생성 중입니다...');

      // 1단계: 줄거리 생성
      const fullCreateRes = await axios.post(
        'http://localhost:3000/ai/StoryCreate/generate',
        { prompt: text.trim(), custom_tag: selectedGenres },
        { withCredentials: true }
      );

      console.log('사용자 입력 텍스트:', text);
      console.log('선택한 장르:', selectedGenres);
      console.log('FullCreate 응답:', fullCreateRes.data);

      const { story_progression } = fullCreateRes.data;

      if (!story_progression) {
        alert('줄거리 생성에 실패했습니다.');
        return;
      }

      // 2단계: 상세 페이지 생성 호출
      const detailRes = await axios.post(
        'http://localhost:3000/ai/StoryCreate/write',
        { prompt : story_progression },  
        { withCredentials: true }
      );

      console.log('WriteDetail 응답:', detailRes.data);

      const pages = detailRes.data.pages_text;
      if (!Array.isArray(pages) || pages.length === 0) {
        alert('페이지 생성에 실패했습니다.');
        return;
      }

      navigate('/imagegenerator', {
        state: {
          mode: 'ai',
          pages: pages,
          genre: selectedGenres
        },
      });

    } catch (error) {
      console.error('동화 생성 중 오류 발생:', error);
      if (error.response) {
        console.error('서버 응답 데이터:', error.response.data);
        alert(`오류: ${error.response.status} ${JSON.stringify(error.response.data)}`);
      } else {
        alert('오류가 발생했습니다. 콘솔을 확인해주세요.');
      }
    }
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

      <GenreSelector selected={selectedGenres} onSelect={setSelectedGenres} />

      <div className="text-center text-muted small mb-4">
        <div>예시 1) 소포아가 ... 숲을 지켜내는 이야기</div>
        <div>예시 2) 등장인물: 빨간머리 앤 ...</div>
        <div>예시 3) 권선징악을 주제로 ...</div>
      </div>

      <div className="text-center">
        <Button
          variant="primary"
          className="px-5 rounded-pill"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? '생성 중...' : '줄거리 생성하기'}
        </Button>
      </div>
    </Container>
  );
};

export default Write_Ai;
