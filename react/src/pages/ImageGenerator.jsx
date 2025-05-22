import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Modal } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import GenreSelector from './GenreSelector';

const ImageGenerator = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState([]); // 배열로 변경
  const [pages, setPages] = useState(['', '', '', '', '']);
  const [currentPage, setCurrentPage] = useState(0);
  const [generatedImages, setGeneratedImages] = useState([[], [], [], [], []]);

  // 새로 추가된 상태: 페이지별 선택된 이미지 URL 저장
  const [selectedImages, setSelectedImages] = useState({}); // {0: 'url1', 1: 'url2', ...}

  const [showGenreModal, setShowGenreModal] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
  const authorId = user?.userId;

  useEffect(() => {
    if (location.state) {
      if (location.state.title) setTitle(location.state.title);
      if (location.state.genre) {
        // location.state.genre가 문자열일 수 있으니 배열로 변환 후 설정
        if (typeof location.state.genre === 'string') {
          setGenre(
            location.state.genre
              .split(',')
              .map((g) => g.trim())
              .filter((g) => g !== '')
          );
        } else if (Array.isArray(location.state.genre)) {
          setGenre(location.state.genre);
        }
      }
      if (location.state.pages) setPages(location.state.pages);
    }
  }, [location.state]);

  const handleImageGenerate = async () => {
    if (!title.trim() || !pages[currentPage].trim()) {
      alert('제목과 페이지 내용을 모두 입력해주세요.');
      return;
    }

    const payload = {
      title,
      textJson: {
        genre:
          typeof genre === 'string'
            ? genre.split(',').map((g) => g.trim())
            : genre,
        pages,
      },
    };
    console.log('Sending payload:', payload);

    try {
      const response = await fetch('http://localhost:8080/api/story/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // <--- 이 부분 추가
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      console.log('Response status:', response.status);
      console.log('Response body:', text);

      if (!response.ok) {
        throw new Error(`스토리 저장 실패: ${response.status} ${text}`);
      }

      alert('스토리 저장 완료');
    } catch (error) {
      console.error(error);
      alert('스토리 저장 중 오류가 발생했습니다.');
    }

    // 이미지 생성 코드
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

  const handleSelectImage = (pageIndex, imageUrl) => {
    setSelectedImages((prev) => ({
      ...prev,
      [pageIndex]: imageUrl,
    }));
  };

  const handleTextChange = (index, value) => {
    const updatedPages = [...pages];
    updatedPages[index] = value;
    setPages(updatedPages);
  };

  const handleCreateStory = () => {
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    for (let i = 0; i < pages.length; i++) {
      if (!pages[i].trim()) {
        alert(`페이지 ${i + 1} 내용을 입력해주세요.`);
        return;
      }
      if (!selectedImages[i]) {
        alert(`페이지 ${i + 1}의 이미지를 선택해주세요.`);
        return;
      }
    }

    const storyData = {
      title,
      genre,
      pages,
      selectedImages,
    };
    localStorage.setItem('myStoryData', JSON.stringify(storyData));

    navigate('/final-check');
  };

  return (
    <Container className="py-5" style={{ maxWidth: '800px' }}>
      <h4 className="fw-bold text-center mb-3">AI 이미지 생성</h4>
      <p className="text-muted text-center mb-4">
        제목, 장르, 각 페이지를 입력하고 이미지 생성
      </p>

      <Form.Group className="mb-3">
        <Form.Label>이야기 제목</Form.Label>
        <Form.Control
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>장르</Form.Label>
        <Form.Control
          readOnly
          value={genre.join(', ')} // 배열을 문자열로 표시
          onClick={() => setShowGenreModal(true)}
          style={{ cursor: 'pointer', backgroundColor: '#f8f9fa' }}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>페이지 {currentPage + 1} 내용</Form.Label>
        <Form.Control
          as="textarea"
          rows={6}
          value={pages[currentPage]}
          onChange={(e) => handleTextChange(currentPage, e.target.value)}
        />
      </Form.Group>

      <div className="text-center mb-4">
        <Button variant="success" onClick={handleImageGenerate}>
          AI 이미지 생성하기
        </Button>
      </div>

      <Row className="text-center mb-4">
        {generatedImages[currentPage].map((img, idx) => {
          const isSelected = selectedImages[currentPage] === img;
          return (
            <Col key={idx} xs={6} md={4} className="mb-3">
              <img
                src={img}
                alt={`Page ${currentPage + 1} - Option ${idx + 1}`}
                onClick={() => handleSelectImage(currentPage, img)}
                style={{
                  width: '150px',
                  height: '150px',
                  cursor: 'pointer',
                  filter: isSelected ? 'none' : 'grayscale(100%)',
                  border: isSelected ? '4px solid #007BFF' : '2px solid #ccc',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                }}
              />
            </Col>
          );
        })}
      </Row>

      <div className="d-flex justify-content-between mb-4">
        <Button
          onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
          disabled={currentPage === 0}
        >
          이전 페이지
        </Button>
        <Button
          onClick={() =>
            setCurrentPage((p) => Math.min(p + 1, pages.length - 1))
          }
          disabled={currentPage === pages.length - 1}
        >
          다음 페이지
        </Button>
      </div>

      <div className="text-center">
        <Button variant="primary" onClick={handleCreateStory}>
          이야기 생성
        </Button>
      </div>

      <Modal
        show={showGenreModal}
        onHide={() => setShowGenreModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>장르 선택</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <GenreSelector
            selected={genre}
            onSelect={(selectedGenres) => {
              const filtered = selectedGenres.filter((g) => g.trim() !== '');
              setGenre(filtered);
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowGenreModal(false)}>
            닫기
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ImageGenerator;
