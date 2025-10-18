// /*
//  * 최근 본 기록
//  * 기여자 : 박경환
//  * 수정일 : 2025-10-19 00:10
//  * 설명 : 최근 본 기록의 핵심로직, 렌더링 관리
// */

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Row, Col, Spinner } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';
// import BookCard from './BookCard'; // ✅ 실제 카드 컴포넌트 사용 시 필요

// const LastWatched = () => {
//   const navigate = useNavigate();
//   const [recentStories] = useState('');

//   const handleClick = (id) => {
//     navigate(`/story/${id}`);
//   };

//   useEffect(() => {
//     axios
//       .get('https://developark.duckdns.org/api_wonderland/story/recent', { withCredentials: true })
//       .then((res) => recentStories(res.data))
//       .catch((err) => console.error('이야기 불러오기 실패:', err));
//   }, []);

//   // ✅ 렌더링
//   return (
//     <div className="d-flex flex-column">
//         {recentStories.length === 0 ? (
//           <p className="text-muted">아직 본 작품이 없습니다.</p>
//         ) : (
//           <Row xs={1} sm={2} md={3} lg={4} className="g-4">
//             {recentStories.map(story => (
//                   <Col key={story.storyId}>
//                     <BookCard
//                       storyId={story.storyId}
//                       image={story.image || 'https://developark.duckdns.org/webdav/bucket/imageholder/place.jpg'}
//                       title={story.title}
//                       author={story.author}
//                       likes={story.likes}
//                       onClick={() => handleClick(story.storyId)}
//                     />
//                   </Col>
//                 ))};
//               </Row>
//            )}
//     </div>
//   );
// };

// export default LastWatched;

/*
 * 최근 본 기록
 * 기여자 : 박경환
 * 수정일 : 2025-10-19 00:10
 * 설명 : 최근 본 기록의 핵심로직, 렌더링 관리 (백엔드 연동 완전 버전)
 */

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Row, Col, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import BookCard from './BookCard';

const LastWatched = () => {
  const navigate = useNavigate();
  const [recentStories, setRecentStories] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleClick = (id) => {
    navigate(`/story/${id}`);
  };

  useEffect(() => {
    const fetchRecentStories = async () => {
      try {
        // ✅ 로그인된 유저 ID 가져오기 (세션 or localStorage 기반)
        const userId = sessionStorage.getItem('nickname') || localStorage.getItem('user');

        if (!userId) {
          console.warn('로그인되지 않음: 최근 본 기록을 불러올 수 없습니다.');
          setRecentStories([]);
          setLoading(false);
          return;
        }

        const res = await axios.get(
          `https://developark.duckdns.org/api_wonderland/story/recent?userId=${userId}`,
          { withCredentials: true }
        );

        setRecentStories(res.data || []);
      } catch (err) {
        console.error('이야기 불러오기 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentStories();
  }, []);

  // ✅ 로딩 상태 표시
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center p-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  // ✅ 렌더링
  return (
    <div className="d-flex flex-column">
      {recentStories.length === 0 ? (
        <p className="text-muted text-center mt-3">아직 본 작품이 없습니다.</p>
      ) : (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4 mt-2">
          {recentStories.map((story) => (
            <Col key={story.storyId}>
              <BookCard
                storyId={story.storyId}
                image={story.image || 'https://developark.duckdns.org/webdav/bucket/imageholder/place.jpg'}
                title={story.title}
                author={story.genre || '장르 미상'}
                likes={story.likes || 0}
                onClick={() => handleClick(story.storyId)}
              />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default LastWatched;