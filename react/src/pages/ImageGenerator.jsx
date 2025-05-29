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
  const [pages, setPages] = useState(['', '', '', '', '']);
  const [currentPage, setCurrentPage] = useState(0);
  const [generatedImages, setGeneratedImages] = useState([[], [], [], [], []]);
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
    const storyId = localStorage.getItem('storyId');
    setMode(m || 'manual');

    // 단일 장르 설정
    if (aiGenre) {
      setGenre(Array.isArray(aiGenre) ? aiGenre[0] || '' : aiGenre);
    }

    // 페이지 및 제목 설정
    if (m === 'ai' && Array.isArray(aiPages)) {
      // aiPages: [{number,text}, ...]
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

  const handleImageGenerate = async () => {
    if (!title.trim() || !pages[currentPage].trim()) {
      alert('제목과 페이지 내용을 모두 입력해주세요.');
      return;
    }

    // 이미지 5개 생성 (더미)
    const fake = Array.from(
      { length: 5 },
      (_, i) =>
        `https://via.placeholder.com/150?text=Page${currentPage + 1}-Img${
          i + 1
        }`
    );

    try {
      const storyData = JSON.parse(localStorage.getItem('myStoryData'));
      const storyId =
        localStorage.getItem('storyId') || location.state?.storyId;

      if (!storyId) {
        alert('스토리 ID가 없습니다. 먼저 스토리를 저장해주세요.');
        return;
      }

      // 2. 서버에 이미지 5개 저장 요청 StoryImageController -> save
      const res = await fetch('http://localhost:8080/api/story/image/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          storyId,
          pageNumber: currentPage + 1,
          imageUrls: fake,
        }),
      });

      if (!res.ok) throw new Error();

      // 3. 이미지 URL 상태 업데이트
      const next = [...generatedImages];
      next[currentPage] = fake;
      setGeneratedImages(next);

      alert('해당 페이지 이미지 5개가 저장되었습니다.');
    } catch (error) {
      alert('이미지 저장 중 오류가 발생했습니다.');
    }
  };

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

  const handleCreateStory = async () => {
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    const nonEmpty = pages.filter((p) => p.trim());
    if (!nonEmpty.length) {
      alert('최소 한 페이지 이상의 내용을 입력해주세요.');
      return;
    }

    // 내용이 있는데 이미지 생성/선택이 안 된 페이지 체크
    const pagesWithContentNoImages = pages
      .map((p, idx) => {
        const hasContent = p.trim().length > 0;
        const hasGeneratedImages = generatedImages[idx].length > 0;
        const hasSelectedImage = !!selectedImages[String(idx + 1)];
        if (hasContent && !hasGeneratedImages && !hasSelectedImage) {
          return idx + 1;
        }
        return null;
      })
      .filter((v) => v !== null);

    if (pagesWithContentNoImages.length > 0) {
      alert(
        `다음 페이지에 내용이 있지만 AI 이미지가 생성되지 않았거나 선택되지 않았습니다.\n` +
          `이미지를 생성하거나, 이미지가 필요 없으면 해당 페이지 내용을 삭제해주세요:` +
          pagesWithContentNoImages.join(', ')
      );
      return;
    }

    // 이미지 생성했지만 선택 안 된 페이지 체크
    const pagesWithImagesButNoSelection = pages
      .map((p, idx) => {
        const imgs = generatedImages[idx];
        if (p.trim() && imgs.length > 0 && !selectedImages[String(idx + 1)]) {
          return idx + 1;
        }
        return null;
      })
      .filter((v) => v !== null);

    if (pagesWithImagesButNoSelection.length > 0) {
      alert(
        `다음 페이지에서 이미지를 선택해주세요: ${pagesWithImagesButNoSelection.join(
          ', '
        )}`
      );
      return;
    }

    if (!Object.keys(selectedImages).length) {
      alert('최소한 한 페이지에서 이미지를 선택해주세요.');
      return;
    }
    // ✅ 여기에 추가: 이미지가 있는데 내용이 없는 페이지 검사
    for (let idx = 0; idx < pages.length; idx++) {
      if (generatedImages[idx].length > 0 && !pages[idx].trim()) {
        const proceed = window.confirm(
          `페이지 ${
            idx + 1
          }에 이미지가 있지만 내용이 비어 있습니다.\n이 상태로 계속 진행하시겠습니까?`
        );
        if (!proceed) return; // 사용자가 아니오(N) 클릭한 경우 함수 종료
      }
    }

    const storyData = { title, genre, pages, selectedImages };

    try {
      // StoryDB_Controller -> create
      const res = await fetch('http://localhost:8080/api/story/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(storyData),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('서버 에러 응답:', errorText);
        throw new Error('스토리 저장 실패');
      }

      const data = await res.json();
      console.log(data.message); // "스토리 저장 완료"

      localStorage.setItem('myStoryData', JSON.stringify(storyData));
      localStorage.setItem('latestStoryId', data.storyId);

      alert('스토리가 성공적으로 저장되었습니다.');
      console.log('저장된 storyId:', data.storyId);
      navigate('/My_Story');
    } catch (error) {
      console.error('스토리 저장 에러:', error);
      alert('스토리 저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <Container className="py-5" style={{ maxWidth: '800px' }}>
      <h4 className="fw-bold text-center mb-3">AI 이미지 생성</h4>
      <p className="text-muted text-center mb-4">
        {mode === 'ai'
          ? 'AI 줄거리 확인 후 이미지 선택'
          : '제목, 장르, 각 페이지를 작성 후 이미지 생성'}
      </p>
      {/* 제목 */}
      <Form.Group className="mb-3">
        <Form.Label>이야기 제목</Form.Label>
        <Form.Control
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          // readOnly={mode === 'ai'}
        />
      </Form.Group>
      {/* 장르 */}
      <Form.Group className="mb-3">
        <Form.Label>장르</Form.Label>
        <Form.Control
          readOnly
          value={genre}
          onClick={() => setShowGenreModal(true)}
          style={{ cursor: 'pointer', backgroundColor: '#f8f9fa' }}
        />
      </Form.Group>
      {/* 페이지 텍스트 */}
      <Form.Group className="mb-3">
        <Form.Label>페이지 {currentPage + 1} 내용</Form.Label>
        <Form.Control
          as="textarea"
          rows={6}
          value={pages[currentPage]}
          onChange={
            (e) => handleTextChange(currentPage, e.target.value)
            // mode === 'manual' && handleTextChange(currentPage, e.target.value)
          }
          // readOnly={mode === 'ai'}
        />
      </Form.Group>
      {/* 이미지 생성 버튼 */}
      <div className="text-center mb-4">
        <Button variant="success" onClick={handleImageGenerate}>
          AI 이미지 생성하기
        </Button>
      </div>
      {/* 이미지 옵션 */}
      <Row className="text-center mb-4">
        {generatedImages[currentPage].map((url, idx) => {
          const isSel = selectedImages[String(currentPage + 1)] === url;
          return (
            <Col key={idx} xs={6} md={4} className="mb-3">
              <img
                src={url}
                alt=""
                onClick={() => handleSelectImage(currentPage, url)}
                style={{
                  width: 150,
                  height: 150,
                  cursor: 'pointer',
                  filter: isSel ? 'none' : 'grayscale(100%)',
                  border: isSel ? '4px solid #007BFF' : '2px solid #ccc',
                  borderRadius: 8,
                  transition: 'all .3s ease',
                }}
              />
            </Col>
          );
        })}
      </Row>
      {/* 페이지 네비 */}
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
      {/* 최종 생성 */}
      <div className="text-center">
        <Button variant="primary" onClick={handleCreateStory}>
          이야기 생성
        </Button>
      </div>
      {/* 장르 모달 */}
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
            // 장르 여러개 선택 할 수 있도록 하려면 아래 코드 주석 해제
            // selected={genre ? [genre] : []}
            // onSelect={(vals) => {
            //   const first = vals.find((g) => g.trim());
            //   setGenre(first || '');
            // }}
            selected={genre ? [genre] : []}
            onSelect={(vals) => {
              // vals가 배열인지 체크 후 처리
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
