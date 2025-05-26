// import React, { useState } from 'react';
// import { Container, Form, Button } from 'react-bootstrap';
// import GenreSelector from './GenreSelector'; // ✅ 장르 컴포넌트 import
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const Write_Ai = () => {
//   const [text, setText] = useState('');
//   const [selectedGenres, setSelectedGenres] = useState([]); // ✅ 선택된 장르 상태
//   const navigate = useNavigate();

//   // const handleGenerate = () => {
//   //   if (!text.trim()) {
//   //     alert('내용을 입력해주세요!');
//   //     return;
//   //   }

//   //   if (selectedGenres.length === 0) {
//   //     alert('장르를 하나 이상 선택해주세요!');
//   //     return;
//   //   }

//   //   // 추후 줄거리 생성 로직 추가
//   //   console.log('입력된 내용:', text);
//   //   console.log('선택된 장르:', selectedGenres);
//   // };
//   const handleGenerate = async () => {
//     if (!text.trim()) {
//       alert('내용을 입력해주세요!');
//       return;
//     }

//     if (selectedGenres.length === 0) {
//       alert('장르를 하나 이상 선택해주세요!');
//       return;
//     }

//     try {
//       const response = await axios.post('/api/story/generate', {
//         prompt: text,
//         genres: selectedGenres,
//       });

//       console.log('입력된 내용:', text);
//       console.log('선택된 장르:', selectedGenres);

//       const { title, pages } = response.data;

//       navigate('/imagegenerator', {
//         state: {
//           mode: 'ai', // 👈 여기에 추가
//           title,
//           pages,
//           genre: selectedGenres,
//         },
//       });
//     } catch (error) {
//       console.error('AI 줄거리 생성 실패:', error);
//       alert('줄거리 생성 중 오류가 발생했습니다.');
//     }
//   };

//   return (
//     <Container className="py-5" style={{ maxWidth: '700px' }}>
//       <h4 className="fw-bold text-center mb-2">
//         원하는 스토리를 자유롭게 적어주세요.
//       </h4>
//       <p className="text-muted text-center mb-4">
//         작은 내용을 토대로 줄거리를 만들어드려요.
//       </p>

//       <Form>
//         <Form.Control
//           as="textarea"
//           rows={8}
//           placeholder="이곳에 작성하기"
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           className="mb-3 shadow-sm"
//           style={{ resize: 'none', borderRadius: '12px' }}
//         />
//       </Form>

//       {/* ✅ 장르 선택 영역 */}
//       <GenreSelector selected={selectedGenres} onSelect={setSelectedGenres} />

//       <div className="text-center text-muted small mb-4">
//         <div>
//           예시 1) 소포아가 신비로운 마법의 숲을 탐험하며 친구들과 함께 숲을
//           지켜내는 이야기
//         </div>
//         <div>
//           예시 2) 등장인물: 빨간머리 앤 &nbsp; 줄거리: 앤이 친구 줄리아와 함께
//           숲으로 놀러간다.
//         </div>
//         <div>
//           예시 3) 권선징악을 주제로 하고 주인공은 고양이가 나쁜 악당을
//           무찔렀으면 좋겠어
//         </div>
//       </div>

//       <div className="text-center">
//         <Button
//           variant="primary"
//           className="px-5 rounded-pill"
//           onClick={handleGenerate}
//         >
//           줄거리 생성하기
//         </Button>
//       </div>
//     </Container>
//   );
// };

// export default Write_Ai;

import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import GenreSelector from './GenreSelector';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Write_Ai = () => {
  const [text, setText] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const navigate = useNavigate();

  // const handleGenerate = async () => {
  //   if (!text.trim()) {
  //     alert('내용을 입력해주세요!');
  //     return;
  //   }

  //   if (selectedGenres.length === 0) {
  //     alert('장르를 하나 이상 선택해주세요!');
  //     return;
  //   }

  //   try {
  //     const requestBody = {
  //       title: text.trim().slice(0, 30), // 예: 간단히 제목으로 처리
  //       genre: selectedGenres,
  //     };

  //     const response = await axios.post(
  //       '/api/story/story_register',
  //       requestBody
  //     );

  //     // 지금은 반환값 확인만, 이후 ImageGenerator에서 fetch 예정
  //     navigate('/imagegenerator', {
  //       state: { mode: 'ai' },
  //     });
  //   } catch (error) {
  //     console.error('줄거리 생성 중 오류 발생:', error);
  //     alert('줄거리 생성 중 오류가 발생했습니다.');
  //   }
  // };
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
      const requestBody = {
        createpage: '5',
        story_progression: text.trim(),
      };
      console.log('보내는 requestBody:', requestBody);

      const response = await axios.post(
        'http://localhost:8080/api/story/story_generate',
        requestBody,
        { withCredentials: true }
      );

      console.log('응답 확인:', response.data);

      navigate('/imagegenerator', {
        state: {
          mode: 'ai',
          pages: response.data.pages_text,
          genre: selectedGenres,
        },
      });
    } catch (error) {
      console.error('줄거리 생성 중 오류 발생:', error);

      if (error.response) {
        alert(
          `AI 텍스트를 불러오는데 실패했습니다. 서버 응답 코드: ${error.response.status}`
        );
        console.error('서버 응답 데이터:', error.response.data);
      } else if (error.request) {
        alert('서버와 연결되지 않았습니다.');
        console.error('요청 정보:', error.request);
      } else {
        alert('요청 설정 중 오류가 발생했습니다.');
        console.error('오류 메시지:', error.message);
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
        <div>
          예시 1) 소포아가 신비로운 마법의 숲을 탐험하며 친구들과 함께 숲을
          지켜내는 이야기
        </div>
        <div>
          예시 2) 등장인물: 빨간머리 앤 &nbsp; 줄거리: 앤이 친구 줄리아와 함께
          숲으로 놀러간다.
        </div>
        <div>
          예시 3) 권선징악을 주제로 하고 주인공은 고양이가 나쁜 악당을
          무찔렀으면 좋겠어
        </div>
      </div>

      <div className="text-center">
        <Button
          variant="primary"
          className="px-5 rounded-pill"
          onClick={handleGenerate}
        >
          줄거리 생성하기
        </Button>
      </div>
    </Container>
  );
};

export default Write_Ai;
