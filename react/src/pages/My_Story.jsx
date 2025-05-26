// import React, { useEffect, useState } from 'react';
// import { Container, Card, Row, Col } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';

// const My_Story = () => {
//   const [storyData, setStoryData] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const savedData = localStorage.getItem('myStoryData');
//     if (savedData) {
//       setStoryData(JSON.parse(savedData));
//     } else {
//       alert('이야기 데이터가 없습니다.');
//       navigate('/');
//     }
//   }, [navigate]);

//   if (!storyData) {
//     return null;
//   }

//   const { title, genre, pages, selectedImages } = storyData;

//   return (
//     <Container className="py-5" style={{ maxWidth: '900px' }}>
//       <h2 className="fw-bold text-center mb-4">{title}</h2>
//       <p className="text-muted text-center mb-4">장르: {genre.join(', ')}</p>

//       {pages.map((text, idx) => {
//         const imageUrl = selectedImages[idx];
//         return (
//           <Card key={idx} className="mb-4 p-3 shadow-sm">
//             <Row className="align-items-center">
//               <Col md={6} className="mb-3 mb-md-0">
//                 {imageUrl ? (
//                   <img
//                     src={imageUrl}
//                     alt={`Page ${idx + 1}`}
//                     style={{
//                       width: '100%',
//                       height: 'auto',
//                       borderRadius: '8px',
//                       objectFit: 'cover',
//                     }}
//                   />
//                 ) : (
//                   <div
//                     style={{
//                       width: '100%',
//                       height: '200px',
//                       backgroundColor: '#eee',
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                       borderRadius: '8px',
//                     }}
//                   >
//                     이미지 없음
//                   </div>
//                 )}
//               </Col>
//               <Col md={6}>
//                 <h5 className="fw-bold mb-3">페이지 {idx + 1}</h5>
//                 <p>{text}</p>
//               </Col>
//             </Row>
//           </Card>
//         );
//       })}
//     </Container>
//   );
// };

// export default My_Story;

import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const My_Story = () => {
  const [storyData, setStoryData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedData = localStorage.getItem('myStoryData');
    if (savedData) {
      setStoryData(JSON.parse(savedData));
    } else {
      alert('이야기 데이터가 없습니다.');
      navigate('/');
    }
  }, [navigate]);

  if (!storyData) {
    return null;
  }

  const { title, genre, pages, selectedImages } = storyData;

  return (
    <Container className="py-5" style={{ maxWidth: '900px' }}>
      <h2 className="fw-bold text-center mb-4">{title}</h2>

      {/* ✅ genre가 문자열이든 배열이든 안전하게 처리 */}
      <p className="text-muted text-center mb-4">
        장르: {Array.isArray(genre) ? genre.join(', ') : genre}
      </p>

      {pages.map((text, idx) => {
        const imageUrl = selectedImages[idx + 1]; // 페이지 번호는 1부터 시작
        return (
          <Card key={idx} className="mb-4 p-3 shadow-sm">
            <Row className="align-items-center">
              <Col md={6} className="mb-3 mb-md-0">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={`Page ${idx + 1}`}
                    style={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: '8px',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '200px',
                      backgroundColor: '#eee',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '8px',
                    }}
                  >
                    이미지 없음
                  </div>
                )}
              </Col>
              <Col md={6}>
                <h5 className="fw-bold mb-3">페이지 {idx + 1}</h5>
                <p>{text}</p>
              </Col>
            </Row>
          </Card>
        );
      })}
    </Container>
  );
};

export default My_Story;
