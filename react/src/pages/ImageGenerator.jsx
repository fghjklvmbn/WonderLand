import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

const ImageGenerator = () => {
  const location = useLocation();
  const [title, setTitle] = useState('');
  const [pages, setPages] = useState(['', '', '', '', '']);
  const [currentPage, setCurrentPage] = useState(0);
  const [generatedImages, setGeneratedImages] = useState([[], [], [], [], []]);

  // 🔧 location.state에서 넘어온 데이터를 초기값으로 설정
  useEffect(() => {
    if (location.state) {
      if (location.state.title) setTitle(location.state.title);
      if (location.state.pages) setPages(location.state.pages);
    }
  }, [location.state]);

  const handlePageChange = (direction) => {
    setCurrentPage((prev) => {
      const next = prev + direction;
      if (next < 0 || next >= pages.length) return prev;
      return next;
    });
  };

  const handleImageGenerate = () => {
    const pageText = pages[currentPage];
    if (!pageText.trim() || !title.trim()) {
      alert('제목과 페이지 내용을 모두 입력해주세요.');
      return;
    }

    const fakeImages = Array.from(
      { length: 5 },
      (_, i) =>
        `https://via.placeholder.com/150?text=Page${currentPage + 1}-Image${
          i + 1
        }`
    );

    const newGeneratedImages = [...generatedImages];
    newGeneratedImages[currentPage] = fakeImages;
    setGeneratedImages(newGeneratedImages);
  };

  const handleTextChange = (index, value) => {
    const updatedPages = [...pages];
    updatedPages[index] = value;
    setPages(updatedPages);
  };

  return (
    <Container className="py-5" style={{ maxWidth: '800px' }}>
      <h4 className="fw-bold text-center mb-3">AI 이미지 생성</h4>
      <p className="text-muted text-center mb-4">
        아래 페이지 내용을 입력하고 이미지를 생성해보세요. 총 5페이지를 차례로
        작업할 수 있습니다.
      </p>

      {/* 제목 입력 */}
      <Form.Group className="mb-4">
        <Form.Label>이야기 제목</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          placeholder="이야기 제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ resize: 'none', borderRadius: '12px' }}
        />
      </Form.Group>

      {/* 현재 페이지 입력 */}
      <Form.Group className="mb-3">
        <Form.Label>페이지 {currentPage + 1} 내용</Form.Label>
        <Form.Control
          as="textarea"
          rows={6}
          placeholder={`페이지 ${currentPage + 1} 내용 입력`}
          value={pages[currentPage]}
          onChange={(e) => handleTextChange(currentPage, e.target.value)}
          style={{ resize: 'none', borderRadius: '12px' }}
        />
      </Form.Group>

      {/* 이미지 생성 버튼 */}
      <div className="text-center mb-4">
        <Button
          variant="success"
          className="rounded-pill px-4"
          onClick={handleImageGenerate}
        >
          이미지 생성하기
        </Button>
      </div>

      {/* 생성된 이미지 출력 */}
      <Row className="text-center mb-4">
        {generatedImages[currentPage].map((img, idx) => (
          <Col key={idx} xs={6} md={4} className="mb-3">
            <img
              src={img}
              alt={`page${currentPage + 1}-img${idx + 1}`}
              className="img-fluid rounded"
            />
          </Col>
        ))}
      </Row>

      {/* 페이지 이동 버튼 */}
      <div className="d-flex justify-content-between">
        <Button
          variant="outline-secondary"
          onClick={() => handlePageChange(-1)}
          disabled={currentPage === 0}
        >
          이전 페이지
        </Button>
        <Button
          variant="outline-secondary"
          onClick={() => handlePageChange(1)}
          disabled={currentPage === pages.length - 1}
        >
          다음 페이지
        </Button>
      </div>
    </Container>
  );
};

export default ImageGenerator;
