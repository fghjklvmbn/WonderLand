// import React, { useState, useEffect } from 'react';
// import { Container, Form, Button, Row, Col, Modal } from 'react-bootstrap';
// import { useLocation, useNavigate } from 'react-router-dom';
// import GenreSelector from './GenreSelector';

// const ImageGenerator = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const [mode, setMode] = useState('manual');
//   const [title, setTitle] = useState('');
//   const [genre, setGenre] = useState([]);
//   const [pages, setPages] = useState(['', '', '', '', '']);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [generatedImages, setGeneratedImages] = useState([[], [], [], [], []]);
//   const [selectedImages, setSelectedImages] = useState({});
//   const [showGenreModal, setShowGenreModal] = useState(false);

//   useEffect(() => {
//     if (!location.state) return;
//     const { mode, pages: aiPages, genre: aiGenre } = location.state;
//     setMode(mode || 'manual');

//     // Set genre
//     if (aiGenre) {
//       setGenre(
//         Array.isArray(aiGenre)
//           ? aiGenre
//           : aiGenre.split(',').map((g) => g.trim())
//       );
//     }

//     if (mode === 'ai') {
//       // AI 모드: write_ai에서 넘겨준 pages_text
//       if (aiPages) {
//         // aiPages is array of { number, text }
//         const loaded = aiPages
//           .sort((a, b) => a.number - b.number)
//           .map((entry) => entry.text);
//         while (loaded.length < 5) loaded.push('');
//         setPages(loaded);
//       }
//       // Title placeholder
//       setTitle('제목을 작성해주세요');
//     } else {
//       // manual 모드: write_manual에서 넘겨준 pages
//       if (Array.isArray(aiPages)) {
//         setPages(aiPages);
//       }
//       // allow title input
//       setTitle(location.state.title || '');
//     }
//   }, [location.state]);

//   const handleImageGenerate = async () => {
//     if (!title.trim() || !pages[currentPage].trim()) {
//       alert('제목과 페이지 내용을 모두 입력해주세요.');
//       return;
//     }

//     const payload = {
//       title,
//       textJson: { genre, pages },
//     };

//     // 저장 로직 동일
//     try {
//       const res = await fetch('http://localhost:8080/api/story/saveOrUpdate', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//         body: JSON.stringify(payload),
//       });
//       if (!res.ok) throw new Error();
//       alert('스토리 임시 저장 또는 업데이트 완료');
//     } catch {
//       alert('스토리 저장 중 오류가 발생했습니다.');
//     }

//     // 샘플 이미지 세팅
//     const fakeImages = Array.from(
//       { length: 5 },
//       (_, i) =>
//         `https://via.placeholder.com/150?text=Page${currentPage + 1}-Image${
//           i + 1
//         }`
//     );
//     const newGen = [...generatedImages];
//     newGen[currentPage] = fakeImages;
//     setGeneratedImages(newGen);
//   };

//   const handleSelectImage = (pageIndex, url) => {
//     setSelectedImages((prev) => ({ ...prev, [pageIndex]: url }));
//   };

//   const handleTextChange = (idx, val) => {
//     const arr = [...pages];
//     arr[idx] = val;
//     setPages(arr);
//   };

//   const handleCreateStory = () => {
//     if (!title.trim()) {
//       alert('제목을 입력해주세요.');
//       return;
//     }
//     const nonEmpty = pages.filter((p) => p.trim());
//     if (!nonEmpty.length) {
//       alert('최소 한 페이지 이상의 내용을 입력해주세요.');
//       return;
//     }
//     if (!Object.keys(selectedImages).length) {
//       alert('최소한 한 페이지에서 이미지를 선택해주세요.');
//       return;
//     }

//     localStorage.setItem(
//       'myStoryData',
//       JSON.stringify({ title, genre, pages, selectedImages })
//     );
//     navigate('/My_Story');
//   };

//   return (
//     <Container className="py-5" style={{ maxWidth: '800px' }}>
//       <h4 className="fw-bold text-center mb-3">AI 이미지 생성</h4>
//       <p className="text-muted text-center mb-4">
//         {mode === 'ai'
//           ? 'AI가 생성한 줄거리 텍스트를 확인 후 이미지 생성'
//           : '제목, 장르, 각 페이지를 입력하고 이미지 생성'}
//       </p>

//       <Form.Group className="mb-3">
//         <Form.Label>이야기 제목</Form.Label>
//         <Form.Control
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           readOnly={mode === 'ai'}
//         />
//       </Form.Group>

//       <Form.Group className="mb-3">
//         <Form.Label>장르</Form.Label>
//         <Form.Control
//           readOnly
//           value={genre.join(', ')}
//           onClick={() => setShowGenreModal(true)}
//           style={{ cursor: 'pointer', backgroundColor: '#f8f9fa' }}
//         />
//       </Form.Group>

//       <Form.Group className="mb-3">
//         <Form.Label>페이지 {currentPage + 1} 내용</Form.Label>
//         <Form.Control
//           as="textarea"
//           rows={6}
//           value={pages[currentPage]}
//           onChange={(e) => handleTextChange(currentPage, e.target.value)}
//           readOnly={mode === 'ai'}
//         />
//       </Form.Group>

//       <div className="text-center mb-4">
//         <Button variant="success" onClick={handleImageGenerate}>
//           AI 이미지 생성하기
//         </Button>
//       </div>

//       <Row className="text-center mb-4">
//         {generatedImages[currentPage].map((img, idx) => (
//           <Col key={idx} xs={6} md={4} className="mb-3">
//             <img
//               src={img}
//               alt={`Page ${currentPage + 1} - Option ${idx + 1}`}
//               onClick={() => handleSelectImage(currentPage, img)}
//               style={{
//                 width: 150,
//                 height: 150,
//                 cursor: 'pointer',
//                 filter:
//                   selectedImages[currentPage] === img
//                     ? 'none'
//                     : 'grayscale(100%)',
//                 border:
//                   selectedImages[currentPage] === img
//                     ? '4px solid #007BFF'
//                     : '2px solid #ccc',
//                 borderRadius: 8,
//                 transition: 'all .3s ease',
//               }}
//             />
//           </Col>
//         ))}
//       </Row>

//       <div className="d-flex justify-content-between mb-4">
//         <Button
//           onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
//           disabled={currentPage === 0}
//         >
//           이전 페이지
//         </Button>
//         <Button
//           onClick={() =>
//             setCurrentPage((p) => Math.min(pages.length - 1, p + 1))
//           }
//           disabled={currentPage === pages.length - 1}
//         >
//           다음 페이지
//         </Button>
//       </div>

//       <div className="text-center">
//         <Button variant="primary" onClick={handleCreateStory}>
//           이야기 생성
//         </Button>
//       </div>

//       <Modal
//         show={showGenreModal}
//         onHide={() => setShowGenreModal(false)}
//         centered
//         size="lg"
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>장르 선택</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <GenreSelector
//             selected={genre}
//             onSelect={(vals) => setGenre(vals.filter((g) => g.trim()))}
//           />
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowGenreModal(false)}>
//             닫기
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </Container>
//   );
// };

// export default ImageGenerator;
import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Modal } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import GenreSelector from './GenreSelector';

const ImageGenerator = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [mode, setMode] = useState('manual');
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState(''); // 단일 문자열
  const [pages, setPages] = useState(['', '', '', '', '']);
  const [currentPage, setCurrentPage] = useState(0);
  const [generatedImages, setGeneratedImages] = useState([[], [], [], [], []]);
  const [selectedImages, setSelectedImages] = useState({}); // ex: { "3": "https://..." }
  const [showGenreModal, setShowGenreModal] = useState(false);

  useEffect(() => {
    if (!location.state) return;

    const {
      mode,
      pages: aiPages,
      genre: aiGenre,
      title: aiTitle,
    } = location.state;
    setMode(mode || 'manual');

    // 1) Genre: 단일 문자열
    if (aiGenre) {
      setGenre(Array.isArray(aiGenre) ? aiGenre[0] || '' : aiGenre);
    }

    // 2) Pages 및 Title 세팅
    if (mode === 'ai') {
      // AI 모드: Write_Ai 에서 받은 pages_text 형태 [{number,text},...]
      if (Array.isArray(aiPages)) {
        const loaded = aiPages
          .sort((a, b) => a.number - b.number)
          .map((e) => e.text);
        while (loaded.length < 5) loaded.push('');
        setPages(loaded);
      }
      setTitle('제목을 작성해주세요');
    } else {
      // manual 모드: Write_Manual 에서 받은 단순 텍스트 배열
      if (Array.isArray(aiPages)) setPages(aiPages);
      setTitle(aiTitle || '');
    }
  }, [location.state]);

  const handleImageGenerate = async () => {
    // 제목과 현 페이지 텍스트 필수
    if (!title.trim() || !pages[currentPage].trim()) {
      alert('제목과 페이지 내용을 모두 입력해주세요.');
      return;
    }

    // payload 구성
    const pagesMap = pages.reduce((acc, txt, idx) => {
      if (txt.trim()) acc[String(idx + 1)] = txt;
      return acc;
    }, {});

    // selectedImages는 { "pageNumber": url }
    const payload = {
      title,
      genre, // 단일 문자열
      textJson: {
        pages: pagesMap,
        selectedImages, // ex: { "2": "https://…" }
      },
    };

    try {
      const res = await fetch('http://localhost:8080/api/story/saveOrUpdate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      alert('스토리 임시 저장 또는 업데이트 완료');
    } catch {
      alert('스토리 저장 중 오류가 발생했습니다.');
      return;
    }

    // 예시용 더미 이미지 생성
    const fake = Array.from(
      { length: 5 },
      (_, i) =>
        `https://via.placeholder.com/150?text=Page${currentPage + 1}-Img${
          i + 1
        }`
    );
    const nxt = [...generatedImages];
    nxt[currentPage] = fake;
    setGeneratedImages(nxt);
  };

  const handleSelectImage = (pageIdx, url) => {
    // 하나만 선택하므로 덮어쓰기
    setSelectedImages({ [String(pageIdx + 1)]: url });
  };

  const handleTextChange = (idx, val) => {
    const arr = [...pages];
    arr[idx] = val;
    setPages(arr);
  };

  const handleCreateStory = () => {
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    const nonEmpty = pages.filter((p) => p.trim());
    if (!nonEmpty.length) {
      alert('최소 한 페이지 이상의 내용을 입력해주세요.');
      return;
    }
    if (!Object.keys(selectedImages).length) {
      alert('최소한 한 페이지에서 이미지를 선택해주세요.');
      return;
    }

    // 최종 데이터: 로컬 스토리지 혹은 navigate state 로 전달
    const storyData = { title, genre, pages, selectedImages };
    localStorage.setItem('myStoryData', JSON.stringify(storyData));
    navigate('/My_Story');
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
          readOnly={mode === 'ai'}
        />
      </Form.Group>

      {/* 장르 (단일) */}
      <Form.Group className="mb-3">
        <Form.Label>장르</Form.Label>
        <Form.Control
          readOnly
          value={genre}
          onClick={() => setShowGenreModal(true)}
          style={{
            cursor: 'pointer',
            backgroundColor: '#f8f9fa',
          }}
        />
      </Form.Group>

      {/* 페이지 텍스트 */}
      <Form.Group className="mb-3">
        <Form.Label>페이지 {currentPage + 1} 내용</Form.Label>
        <Form.Control
          as="textarea"
          rows={6}
          value={pages[currentPage]}
          onChange={(e) =>
            mode === 'manual' && handleTextChange(currentPage, e.target.value)
          }
          readOnly={mode === 'ai'}
        />
      </Form.Group>

      {/* 이미지 생성 (샘플) */}
      <div className="text-center mb-4">
        <Button variant="success" onClick={handleImageGenerate}>
          AI 이미지 생성하기
        </Button>
      </div>

      {/* 생성된 이미지 옵션 */}
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

      {/* 페이지 네비게이션 */}
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

      {/* 최종 스토리 생성 */}
      <div className="text-center">
        <Button variant="primary" onClick={handleCreateStory}>
          이야기 생성
        </Button>
      </div>

      {/* 장르 선택 모달 */}
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
              const first = vals.find((g) => g.trim());
              setGenre(first || '');
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
