import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Row, Col, Modal } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import GenreSelector from './GenreSelector';
import axios from 'axios';

const ContinueStoryPage = () => {
  const { storyId } = useParams(); // URL의 :storyId
  const navigate = useNavigate();

  // 1) 상태 정의
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState(''); // genre는 DTO에서 내려주는 경우 없으면 빈 문자열
  const [pages, setPages] = useState([]); // [{text, image_url}, ...]
  const [selectedImages, setSelectedImages] = useState({}); // { "1": "url", "3": "url" }
  const [currentPage, setCurrentPage] = useState(0);

  const [showGenreModal, setShowGenreModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);
  const [generatedImages, setGeneratedImages] = useState([[], [], [], [], []]);
  // const [storyId, setStoryId] = useState(null);

  // ─────────────────────────────────────────────────────────────────
  // 2) 마운트 시: GET /api/stories/{storyId} 호출해서 “페이지 데이터” 가져오기
  useEffect(() => {
    if (!storyId) {
      alert('유효한 스토리 ID가 없습니다.');
      navigate('/');
      return;
    }

    setIsLoading(true);
    axios
      .get(`http://localhost:8080/api/stories/${storyId}`, {
        withCredentials: true,
      })
      .then((res) => {
        const data = res.data;
        console.log(data);
        setTitle(data.title || '');
        setGenre(data.genre || '');
        setPages(data.pages || []);
        setSelectedImages(data.selected_json || {});
      })
      .catch((err) => {
        console.error('스토리 불러오기 실패:', err);
        alert('스토리 데이터를 불러올 수 없습니다.');
        navigate('/');
      })
      .finally(() => {
        setIsLoading(false); // ✅ 반드시 마지막에 호출
      });
    axios
      .get(
        `http://localhost:8080/api/story/image/list?storyId=${storyId}&pageNumber=${
          currentPage + 1
        }`,
        {
          withCredentials: true,
        }
      )

      .then((res) => {
        const newImages = [...generatedImages];
        newImages[currentPage] = res.data; // 이미지 URL 배열
        setGeneratedImages(newImages);
      })
      .catch((err) => {
        console.error('이미지 로딩 실패:', err);
      });
  }, [storyId, currentPage]);

  // ─────────────────────────────────────────────────────────────────
  // 페이지 텍스트 수정
  const handleTextChange = (idx, val) => {
    const copy = [...pages];
    copy[idx].text = val;
    setPages(copy);
  };

  // 선택 이미지 변경
  const handleSelectImage = (pageIdx, url) => {
    setSelectedImages((prev) => ({
      ...prev,
      [String(pageIdx + 1)]: url,
    }));
  };

  // ─────────────────────────────────────────────────────────────────
  // “스토리 업데이트” (제목/텍스트/이미지 반영) 예시
  const handleUpdateStory = async () => {
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    // 최소 한 페이지 이상 텍스트
    const nonEmptyPages = pages.filter((p) => p.text?.trim());
    if (nonEmptyPages.length === 0) {
      alert('최소 한 페이지 이상의 텍스트를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      // 1) 제목·텍스트 업데이트
      await axios.put(
        `http://localhost:8080/api/stories/${storyId}`,
        {
          title,
          // 백엔드 updateStory 로직은 textJson을 쓰지 않으므로,
          // 필요하다면 텍스트 JSON을 직접 보내는 별도 엔드포인트를 만들어야 합니다.
        },
        { withCredentials: true }
      );

      // 2) 선택 이미지 업데이트 (selected_json 필드 덮어쓰기)
      //    예시 엔드포인트: PUT /api/stories/{storyId}/selected-images
      await axios.put(
        `http://localhost:8080/api/stories/${storyId}/selected-images`,
        { selectedJson: selectedImages },
        { withCredentials: true }
      );

      alert('스토리가 성공적으로 업데이트되었습니다.');
      navigate('/My_Story');
    } catch (err) {
      console.error('스토리 업데이트 실패:', err);
      alert('업데이트 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageGenerate = async () => {
    if (!title || !genre || !pages) {
      alert('제목, 장르, 페이지 내용이 모두 있어야 합니다.');
      return;
    }

    setIsLoading(true);

    try {
      let currentStoryId = storyId;

      if (currentStoryId) {
        // ②: 이미 storyId가 있으면 update 요청
        const updateRes = await fetch(
          'http://localhost:8080/api/story/update_manualDB',
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              storyId: currentStoryId,
              title: title,
              genre: genre,
              textJson: { pages },
            }),
          }
        );
        if (!updateRes.ok) {
          const errorMsg = await updateRes.text();
          throw new Error(errorMsg || '스토리 업데이트 실패');
        }
      }

      localStorage.setItem('storyId', currentStoryId);
      console.log('최초 저장된 story_ID:', currentStoryId);

      alert(
        '이미지를 생성 중입니다.\n약 10~20초 정도 소요됩니다.\n그동안 다음 페이지의 내용을 검토해주세요!'
      );

      setIsGenerating((prev) => {
        const copy = [...prev];
        copy[currentPage] = true;
        return copy;
      });

      // ───────────────────────────────────────────────────────

      // 4) imagePrompt를 Spring Boot 이미지 생성 API에 전달
      let imagePrompt;
      const pay = { prompt: imagePrompt };

      const res = await fetch('http://localhost:8080/api/image/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(pay),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error('Spring 이미지 생성 에러 응답:', errText);
        throw new Error('이미지 생성 요청 실패');
      }

      const data = await res.json();
      if (!data.success || !Array.isArray(data.imageUrls)) {
        throw new Error('이미지 URL 응답이 올바르지 않습니다');
      }

      const urls = data.imageUrls.map((path) => `http://localhost:8080${path}`);

      // 5) 생성된 이미지 상태 저장
      setGeneratedImages((prev) => {
        const copy = [...prev];
        copy[currentPage] = urls;
        return copy;
      });

      // 6) DB에 이미지 URL도 같이 저장
      if (currentStoryId) {
        const saveRes = await fetch(
          'http://localhost:8080/api/story/image/save',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              storyId: currentStoryId,
              pageNumber: currentPage + 1,
              imageUrls: urls,
            }),
          }
        );

        const saveText = await saveRes.text();
        if (!saveRes.ok) {
          console.error('이미지 저장 에러:', saveText);
        } else {
          console.log('이미지 저장 완료:', saveText);
        }
      } else {
        console.warn('storyId가 없어 이미지 저장 API를 호출하지 않았습니다.');
      }
      // ───────────────────────────────────────────────────────
    } catch (error) {
      console.error('이미지 생성 중 오류:', error);
      alert(error.message || '이미지 생성에 실패했습니다.');
    } finally {
      setIsGenerating((prev) => {
        const copy = [...prev];
        copy[currentPage] = false;
        return copy;
      });
      setIsLoading(false);
    }
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

    const storyData = { storyId, title, genre, pages, selectedImages };

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

      alert('스토리가 성공적으로 저장되었습니다.');
      console.log('저장된 storyId:', data.storyId);
      // setStoryId(data.storyId); // storyId 갱신
      localStorage.setItem('myStoryData', JSON.stringify(storyData));
      localStorage.setItem('latestStoryId', data.storyId);
      navigate('/My_Story');
    } catch (error) {
      console.error('스토리 저장 에러:', error);
      alert('스토리 저장 중 오류가 발생했습니다.');
    }
  };

  // ─────────────────────────────────────────────────────────────────
  if (isLoading) {
    return <div className="text-center mt-5">로딩 중...</div>;
  }
  if (!pages.length) {
    return <div className="text-center mt-5">페이지가 없습니다.</div>;
  }

  return (
    <Container className="py-5" style={{ maxWidth: '800px' }}>
      <h4 className="fw-bold text-center mb-3">AI 이미지 생성</h4>
      <p className="text-muted text-center mb-4"></p>
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
      {/* <Form.Group className="mb-3">
        <Form.Label>페이지 {currentPage + 1} 내용</Form.Label>
        <Form.Control
          as="textarea"
          rows={6}
          value={pages[currentPage]}
          onChange={(e) => handleTextChange(currentPage, e.target.value)}
        />
      </Form.Group> */}
      <Form.Group className="mb-3">
        <Form.Label>페이지 {currentPage + 1} 내용</Form.Label>
        <Form.Control
          as="textarea"
          rows={6}
          value={pages[currentPage]?.text || ''}
          onChange={(e) => handleTextChange(currentPage, e.target.value)}
        />
      </Form.Group>

      {/* AI 이미지 생성 버튼 */}
      <div className="text-center mb-4">
        <Button
          variant="success"
          onClick={() => handleImageGenerate(currentPage)}
          disabled={isGenerating[currentPage]}
        >
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

export default ContinueStoryPage;
