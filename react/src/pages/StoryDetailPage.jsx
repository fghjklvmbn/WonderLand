// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import { Button, Row, Col } from 'react-bootstrap';

// const StoryDetailPage = () => {
//   const { id } = useParams();
//   const [storyPages, setStoryPages] = useState([]);
//   const [pageIndex, setPageIndex] = useState(0);
//   const [storyTitle, setStoryTitle] = useState('');

//   useEffect(() => {
//     axios
//       .get(`http://localhost:8080/api/stories/${id}`)
//       .then((res) => {
//         const pages = res.data.pages || [];
//         setStoryPages(pages);

//         if (res.data.title) {
//           setStoryTitle(res.data.title);
//         }
//         if (res.data.selected_json) {
//           setSelectedImages(res.data.selected_json);
//         }
//       })
//       .catch((err) => {
//         console.error('이야기 불러오기 실패:', err);
//       });
//   }, [id]);

//   if (storyPages.length === 0)
//     return <div className="text-center mt-5">Loading...</div>;

//   const totalPageCount = storyPages.length + 1;
//   const currentPage = pageIndex === 0 ? null : storyPages[pageIndex - 1];
//   const coverImage = storyPages[0]?.image_url || '';

//   const playTTS = () => {
//     const audio = new Audio(currentPage.tts_url);
//     audio.play();
//   };

//   const nextPage = () => {
//     if (pageIndex < totalPageCount - 1) setPageIndex(pageIndex + 1);
//   };

//   const prevPage = () => {
//     if (pageIndex > 0) setPageIndex(pageIndex - 1);
//   };

//   return (
//     <main
//       style={{
//         flex: 1,
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         padding: '30px 20px',
//       }}
//     >
//       {pageIndex === 0 ? (
//         <Row
//           className="shadow border rounded bg-white w-100"
//           style={{
//             maxWidth: '1300px',
//             minHeight: '400px',
//             padding: '30px',
//             display: 'flex',
//             alignItems: 'center',
//           }}
//         >
//           <Col
//             md={6}
//             className="d-flex justify-content-center align-items-center"
//           >
//             <img
//               src={coverImage}
//               alt="cover"
//               className="img-fluid rounded"
//               style={{ maxHeight: '100%', objectFit: 'contain' }}
//             />
//           </Col>
//           <Col
//             md={6}
//             className="d-flex justify-content-center align-items-center"
//           >
//             <h2 style={{ textAlign: 'center', fontWeight: 'bold' }}>
//               {storyTitle || '제목 없음'}
//             </h2>
//           </Col>
//         </Row>
//       ) : (
//         <Row
//           className="shadow border rounded bg-white w-100"
//           style={{
//             maxWidth: '1300px',
//             minHeight: '600px',
//             padding: '30px',
//             display: 'flex',
//             alignItems: 'center',
//           }}
//         >
//           <Col
//             md={6}
//             className="d-flex justify-content-center align-items-center"
//           >
//             <img
//               src={currentPage.image_url}
//               alt={`page-${pageIndex}`}
//               className="img-fluid rounded"
//               style={{ maxHeight: '100%', objectFit: 'contain' }}
//             />
//           </Col>

//           <Col md={6} className="d-flex flex-column justify-content-center">
//             <div style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
//               {currentPage.text}
//             </div>
//           </Col>
//         </Row>
//       )}

//       <div className="text-center my-3">
//         <Button
//           variant="secondary"
//           onClick={prevPage}
//           disabled={pageIndex === 0}
//         >
//           ◀ 이전
//         </Button>{' '}
//         <span className="mx-3">
//           Page {pageIndex + 1} / {totalPageCount}
//         </span>
//         <Button
//           variant="secondary"
//           onClick={nextPage}
//           disabled={pageIndex === totalPageCount - 1}
//         >
//           다음 ▶
//         </Button>
//       </div>

//       {pageIndex !== 0 && (
//         <Button
//           variant="primary"
//           onClick={playTTS}
//           style={{
//             position: 'fixed',
//             bottom: '80px',
//             right: '30px',
//             zIndex: 9999,
//             borderRadius: '50px',
//             padding: '12px 20px',
//             boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
//           }}
//         >
//           🔊 음성 듣기
//         </Button>
//       )}
//     </main>
//   );
// };

// export default StoryDetailPage;
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Button, Row, Col } from 'react-bootstrap';

const StoryDetailPage = () => {
  const { id } = useParams();
  const [storyPages, setStoryPages] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [storyTitle, setStoryTitle] = useState('');
  const [selectedImages, setSelectedImages] = useState({});

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/stories/${id}`)
      .then((res) => {
        console.log('전체 응답:', res.data);
        console.log('selectedImages:', res.data.selected_json);
        // console.log('selectedImages[5]:', res.data.selected_json['5']);
        const pages = res.data.pages || [];
        setStoryPages(pages);

        if (res.data.title) {
          setStoryTitle(res.data.title);
        }
        if (res.data.selected_json) {
          setSelectedImages(res.data.selected_json);
          console.log('selectedImages:', res.data.selected_json);
          console.log('selectedImages[5]:', res.data.selected_json['5']);
        }
      })
      .catch((err) => {
        console.error('이야기 불러오기 실패:', err);
      });
  }, [id]);

  if (storyPages.length === 0)
    return <div className="text-center mt-5">Loading...</div>;

  const totalPageCount = storyPages.length + 1;
  const currentPage = pageIndex === 0 ? null : storyPages[pageIndex - 1];
  // const lastImageIndex = String(storyPages.length - 1);
  const coverImageUrl = selectedImages['1'];

  const playTTS = () => {
    const audio = new Audio(currentPage.tts_url);
    audio.play();
  };

  const nextPage = () => {
    if (pageIndex < totalPageCount - 1) setPageIndex(pageIndex + 1);
  };

  const prevPage = () => {
    if (pageIndex > 0) setPageIndex(pageIndex - 1);
  };

  return (
    <main
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '30px 20px',
      }}
    >
      {pageIndex === 0 ? (
        <Row
          className="shadow border rounded bg-white w-100"
          style={{
            maxWidth: '1300px',
            minHeight: '400px',
            padding: '30px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Col
            md={6}
            className="d-flex justify-content-center align-items-center"
          >
            <img
              src={coverImageUrl}
              alt="cover"
              className="img-fluid rounded"
              style={{ maxHeight: '100%', objectFit: 'contain' }}
            />
          </Col>
          <Col
            md={6}
            className="d-flex justify-content-center align-items-center"
          >
            <h2 style={{ textAlign: 'center', fontWeight: 'bold' }}>
              {storyTitle || '제목 없음'}
            </h2>
          </Col>
        </Row>
      ) : (
        <Row
          className="shadow border rounded bg-white w-100"
          style={{
            maxWidth: '1300px',
            minHeight: '600px',
            padding: '30px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Col
            md={6}
            className="d-flex justify-content-center align-items-center"
          >
            <img
              src={currentPage.image_url}
              alt={`page-${pageIndex}`}
              className="img-fluid rounded"
              style={{ maxHeight: '100%', objectFit: 'contain' }}
            />
          </Col>

          <Col md={6} className="d-flex flex-column justify-content-center">
            <div style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
              {currentPage.text}
            </div>
          </Col>
        </Row>
      )}

      <div className="text-center my-3">
        <Button
          variant="secondary"
          onClick={prevPage}
          disabled={pageIndex === 0}
        >
          ◀ 이전
        </Button>{' '}
        <span className="mx-3">
          Page {pageIndex + 1} / {totalPageCount}
        </span>
        <Button
          variant="secondary"
          onClick={nextPage}
          disabled={pageIndex === totalPageCount - 1}
        >
          다음 ▶
        </Button>
      </div>

      {pageIndex !== 0 && (
        <Button
          variant="primary"
          onClick={playTTS}
          style={{
            position: 'fixed',
            bottom: '80px',
            right: '30px',
            zIndex: 9999,
            borderRadius: '50px',
            padding: '12px 20px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
          }}
        >
          🔊 음성 듣기
        </Button>
      )}
    </main>
  );
};

export default StoryDetailPage;
