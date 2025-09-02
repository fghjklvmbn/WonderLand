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

  const [isGenerating, setIsGenerating] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);

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

  const [storyId, setStoryId] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // 선언 필요

  // const handleImageGenerate = async () => {
  //   if (!title || !genre || !pages) {
  //     alert('제목, 장르, 페이지 내용이 모두 있어야 합니다.');
  //     return;
  //   }

  //   setIsLoading(true);

  //   try {
  //     let currentStoryId = storyId;

  //     if (!currentStoryId) {
  //       // 최초 저장 (Insert)
  //       const res = await fetch(
  //         'http://localhost:8080/api/story/write_manualDB',
  //         {
  //           method: 'POST',
  //           headers: { 'Content-Type': 'application/json' },
  //           credentials: 'include',
  //           body: JSON.stringify({
  //             title: title,
  //             genre: genre,
  //             textJson: { pages },
  //           }),
  //         }
  //       );

  //       if (!res.ok) {
  //         const errorMsg = await res.text();
  //         throw new Error(errorMsg || '스토리 저장 실패');
  //       }

  //       const data = await res.json();
  //       currentStoryId = data.storyId;
  //       setStoryId(currentStoryId);
  //       localStorage.setItem('storyId', currentStoryId);
  //     } else {
  //       // 이미 storyId가 있을 때는 업데이트 요청 (Update)
  //       const updateRes = await fetch(
  //         'http://localhost:8080/api/story/update_manualDB',
  //         {
  //           method: 'PUT',
  //           headers: { 'Content-Type': 'application/json' },
  //           credentials: 'include',
  //           body: JSON.stringify({
  //             storyId: currentStoryId,
  //             title: title,
  //             genre: genre,
  //             textJson: { pages },
  //           }),
  //         }
  //       );

  //       if (!updateRes.ok) {
  //         const errorMsg = await updateRes.text();
  //         throw new Error(errorMsg || '스토리 업데이트 실패');
  //       }
  //     }

  //     localStorage.setItem('storyId', currentStoryId);
  //     console.log('최초 저장된 story_ID:', currentStoryId);

  //     alert(
  //       '이미지를 생성 중입니다.\n약 10~20초 정도 소요됩니다.\n그동안 다음 페이지의 내용을 검토해주세요!'
  //     );

  //     setIsGenerating((prev) => {
  //       const copy = [...prev];
  //       copy[currentPage] = true;
  //       return copy;
  //     });

  //     // 이미지 생성 요청 페이로드
  //     const pay = {
  //       prompt: pages[currentPage], // 현재 페이지 텍스트
  //     };

  //     const res = await fetch('http://localhost:8080/api/image/generate', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       credentials: 'include',
  //       body: JSON.stringify(pay),
  //     });

  //     if (!res.ok) {
  //       const errText = await res.text();
  //       console.error('Spring 에러 응답:', errText);
  //       throw new Error('이미지 생성 요청 실패');
  //     }

  //     const data = await res.json();
  //     if (!data.success || !Array.isArray(data.imageUrls)) {
  //       throw new Error('이미지 URL 응답이 올바르지 않습니다');
  //     }

  //     const urls = data.imageUrls.map((path) => `http://localhost:8080${path}`);

  //     // 생성된 이미지 상태 저장
  //     setGeneratedImages((prev) => {
  //       const copy = [...prev];
  //       copy[currentPage] = urls;
  //       return copy;
  //     });

  //     // 이미지 저장 API 호출
  //     if (currentStoryId) {
  //       const saveRes = await fetch(
  //         'http://localhost:8080/api/story/image/save',
  //         {
  //           method: 'POST',
  //           headers: { 'Content-Type': 'application/json' },
  //           credentials: 'include',
  //           body: JSON.stringify({
  //             storyId: currentStoryId,
  //             pageNumber: currentPage + 1,
  //             imageUrls: urls,
  //           }),
  //         }
  //       );

  //       const saveText = await saveRes.text(); // 응답 본문 미리 읽어두기

  //       if (!saveRes.ok) {
  //         console.error('이미지 저장 에러:', saveText);
  //       } else {
  //         console.log('이미지 저장 완료:', saveText); // ✅ 여기에 출력 추가!
  //       }
  //     } else {
  //       console.warn('storyId가 없어 이미지 저장 API를 호출하지 않았습니다.');
  //     }
  //   } catch (error) {
  //     console.error('이미지 생성 중 오류:', error);
  //     alert('이미지 생성에 실패했습니다.');
  //   } finally {
  //     setIsGenerating((prev) => {
  //       const copy = [...prev];
  //       copy[currentPage] = false;
  //       return copy;
  //     });
  //     setIsLoading(false);
  //   }
  // };

  // ─────────────────────────────────────────────────────────────────────
  // ImageGenerator.jsx

  const handleImageGenerate = async () => {
    if (!title || !genre || !pages) {
      alert('제목, 장르, 페이지 내용이 모두 있어야 합니다.');
      return;
    }

    setIsLoading(true);

    try {
      let currentStoryId = storyId;

      // ①: storyId가 없으면 최초 저장(insert) 후 storyId 획득
      if (!currentStoryId) {
        const res = await fetch(
          'http://localhost:8080/api/story/write_manualDB',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              title: title,
              genre: genre,
              textJson: { pages },
            }),
          }
        );

        if (!res.ok) {
          const errorMsg = await res.text();
          throw new Error(errorMsg || '스토리 저장 실패');
        }

        const data = await res.json();
        currentStoryId = data.storyId;
        setStoryId(currentStoryId);
        localStorage.setItem('storyId', currentStoryId);
      } else {
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
      // 3) mode가 'ai'인 경우 Flask stub로부터 image_prompt 받아오기
      let imagePrompt;

      if (mode === 'ai') {
        // Flask endpoint 호출
        const detail = pages[currentPage];
        const promptRes = await fetch(
          'http://localhost:3001/ai/prompt/artprompt/',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ detail }),
          }
        );

        if (!promptRes.ok) {
          const errText = await promptRes.text();
          console.error('Flask artprompt 에러 응답:', errText);
          throw new Error('이미지 프롬프트 생성 실패');
        }

        const promptData = await promptRes.json();
        if (!promptData || typeof promptData.image_prompt !== 'string') {
          console.error('Flask 응답이 올바르지 않습니다:', promptData);
          throw new Error('Flask에서 유효한 image_prompt를 받지 못했습니다.');
        }

        imagePrompt = promptData.image_prompt;
        console.log('Flask로부터 받은 image_prompt:', imagePrompt);
      } else {
        // mode가 'manual'인 경우, page 텍스트를 그대로 prompt로 사용
        imagePrompt = pages[currentPage];
        console.log(
          'Manual 모드이므로 페이지 텍스트를 imagePrompt로 사용:',
          imagePrompt
        );
      }

      // 4) imagePrompt를 Spring Boot 이미지 생성 API에 전달
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
      setStoryId(data.storyId); // storyId 갱신
      localStorage.setItem('myStoryData', JSON.stringify(storyData));
      localStorage.setItem('latestStoryId', data.storyId);
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

export default ImageGenerator;
