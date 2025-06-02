import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Modal } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import GenreSelector from './GenreSelector';

const ImageGenerator = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [mode, setMode] = useState('manual');
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  // pages: 5개 페이지 텍스트
  const [pages, setPages] = useState(['', '', '', '', '']);
  const [currentPage, setCurrentPage] = useState(0);

  // 기존에는 [[], [], [], [], []] 형태였는데, 이제 string URL 리스트를 받아 올 것이므로 초기값 유지
  const [generatedImages, setGeneratedImages] = useState([[], [], [], [], []]);
  // 사용자가 클릭하여 선택한 이미지 URL을 저장
  const [selectedImages, setSelectedImages] = useState({});

  const [showGenreModal, setShowGenreModal] = useState(false);

  useEffect(() => {
    if (!location.state) return;
    const {
      mode: m,
      pages: aiPages,
      genre: aiGenre,
      title: aiTitle,
    } = location.state;
    setMode(m || 'manual');

    if (aiGenre) {
      setGenre(Array.isArray(aiGenre) ? aiGenre[0] || '' : aiGenre);
    }

    if (m === 'ai' && Array.isArray(aiPages)) {
      const loaded = aiPages
        .sort((a, b) => a.number - b.number)
        .map((e) => e.text);
      while (loaded.length < 5) loaded.push('');
      setPages(loaded);
      setTitle(aiTitle || '제목을 작성해주세요');
    } else if (m === 'manual') {
      if (Array.isArray(aiPages)) setPages(aiPages);
      setTitle(aiTitle || '');
    }
  }, [location.state]);

  // ─────────────────────────────────────────────────────────────────────

  // ✨ **핵심**: 실제 Gradio → Spring → 이미지를 생성하고 넘어오는 부분
  const handleImageGenerate = async () => {
    if (!title.trim() || !pages[currentPage].trim()) {
      alert('제목과 페이지 내용을 모두 입력해주세요.');
      return;
    }

    try {
      // 1) 프론트에서 백엔드(Spring)에 요청 보낼 페이로드 구성
      //    prompt: 현재 페이지의 텍스트(pages[currentPage])를 넣자.
      const pay = {
        prompt: pages[currentPage],
        // seed나 cfg_scale, temperature를 추가로 넘기고 싶으면 여기에 넣으면 됨
        // seed: 42,
        // cfg_scale: 7.0,
        // temperature: 0.7
      };

      // 2) Spring Boot 서버의 엔드포인트 호출 (/api/image/generate)
      const res = await fetch('http://localhost:8080/api/image/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // 필요 시
        body: JSON.stringify(pay),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error('Spring 에러 응답:', errText);
        throw new Error('이미지 생성 요청 실패');
      }

      const data = await res.json();
      if (!data.success || !Array.isArray(data.imageUrls)) {
        throw new Error('이미지 URL 응답이 올바르지 않습니다');
      }

      // 3) Spring이 반환한 imageUrls (예: ["/output/gen_20230607_121314_00.png", ...])
      const urls = data.imageUrls.map((path) => {
        // React에서 직접 접근할 때는 절대경로를 붙여야 함
        // 예: http://localhost:8080/output/xxxxx.png
        return `http://localhost:8080${path}`;
      });

      // 4) 상태 업데이트 → 해당 페이지에 URLs 저장
      const copy = [...generatedImages];
      copy[currentPage] = urls;
      setGeneratedImages(copy);
    } catch (error) {
      console.error('이미지 생성 중 오류:', error);
      alert('이미지 생성에 실패했습니다.');
    }
  };

  // 사용자가 이미지를 클릭하여 “선택”할 때 호출
  const handleSelectImage = (pageIdx, url) => {
    setSelectedImages((prev) => ({
      ...prev,
      [String(pageIdx + 1)]: url,
    }));
  };

  const handleTextChange = (idx, val) => {
    const arr = [...pages];
    arr[idx] = val;
    setPages(arr);
  };

  // ─────────────────────────────────────────────────────────────────────

  const handleCreateStory = async () => {
    // (기존의 유효성 검사 로직 그대로 가져오면 됩니다)
    // ...
  };

  return (
    <Container className="py-5" style={{ maxWidth: '800px' }}>
      <h4 className="fw-bold text-center mb-3">AI 이미지 생성</h4>
      <p className="text-muted text-center mb-4">
        {mode === 'ai'
          ? 'AI 줄거리 확인 후 이미지 선택'
          : '제목, 장르, 각 페이지를 작성 후 이미지 생성'}
      </p>
      {/* 제목 입력 */}
      <Form.Group className="mb-3">
        <Form.Label>이야기 제목</Form.Label>
        <Form.Control
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </Form.Group>

      {/* 장르 선택 */}
      <Form.Group className="mb-3">
        <Form.Label>장르</Form.Label>
        <Form.Control
          readOnly
          value={genre}
          onClick={() => setShowGenreModal(true)}
          style={{ cursor: 'pointer', backgroundColor: '#f8f9fa' }}
        />
      </Form.Group>

      {/* 페이지 텍스트 입력 */}
      <Form.Group className="mb-3">
        <Form.Label>페이지 {currentPage + 1} 내용</Form.Label>
        <Form.Control
          as="textarea"
          rows={6}
          value={pages[currentPage]}
          onChange={(e) => handleTextChange(currentPage, e.target.value)}
        />
      </Form.Group>

      {/* AI 이미지 생성 버튼 */}
      <div className="text-center mb-4">
        <Button variant="success" onClick={handleImageGenerate}>
          AI 이미지 생성하기
        </Button>
      </div>

      {/* 생성된 이미지가 있으면 표시 */}
      <Row className="text-center mb-4">
        {generatedImages[currentPage].map((url, idx) => {
          // 클릭 시 선택된 이미지는 border가 강조됨
          const isSelected = selectedImages[String(currentPage + 1)] === url;
          return (
            <Col key={idx} xs={6} md={4} className="mb-3">
              <img
                src={url}
                alt={`Generated-${idx}`}
                onClick={() => handleSelectImage(currentPage, url)}
                style={{
                  width: 150,
                  height: 150,
                  cursor: 'pointer',
                  filter: isSelected ? 'none' : 'none',
                  border: isSelected ? '4px solid #007BFF' : '2px solid #ccc',
                  borderRadius: 8,
                  transition: 'all .3s ease',
                }}
              />
            </Col>
          );
        })}
      </Row>

      {/* 페이지 넘기기 버튼 */}
      <div className="d-flex justify-content-between mb-4">
        <Button
          onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
          disabled={currentPage === 0}
        >
          이전
        </Button>
        <Button
          onClick={() =>
            setCurrentPage((p) => Math.min(pages.length - 1, p + 1))
          }
          disabled={currentPage === pages.length - 1}
        >
          다음
        </Button>
      </div>

      {/* 최종 “이야기 생성” 버튼 */}
      <div className="text-center">
        <Button variant="primary" onClick={handleCreateStory}>
          이야기 생성
        </Button>
      </div>

      {/* 장르 선택 모달 (기존 로직 유지) */}
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
            selected={genre ? [genre] : []}
            onSelect={(vals) => {
              if (Array.isArray(vals)) {
                const first = vals.find((g) => g.trim());
                setGenre(first || '');
              } else if (typeof vals === 'string') {
                setGenre(vals.trim() || '');
              } else {
                setGenre('');
              }
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
