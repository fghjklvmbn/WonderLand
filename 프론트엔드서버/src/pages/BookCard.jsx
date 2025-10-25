/*
 * 컨텐츠(책) 정보
 * 기여자 : 박경환, 정현호, 정우빈
 * 수정일 : 2025-10-25 23:06
 * 설명 : 책 정보 확인, 최근 본 작품기록 갱신로직, 좋아요 기능 핵심로직
*/

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BookCard = ({ storyId, image, title, author, likes, onLikeUpdate }) => {
  const navigate = useNavigate();
  const [isLoggedIn] = useState(() => sessionStorage.getItem('isLoggedIn'));
  const [localLikes, setLocalLikes] = useState(likes);

  const handleClick = async () => {
    if (isLoggedIn) {
      try {
        await axios.post(
          `https://developark.duckdns.org/api_wonderland/story/recent/${storyId}`,
          {},
          { withCredentials: true }
        );
      } catch (error) {
        console.error('최근 본 작품 기록 실패:', error);
      }
    }
    navigate(`/story/${storyId}`);
  };

  const handleLike = async () => {
    if (!isLoggedIn) {
      alert('로그인 후 이용 가능합니다.');
      return;
    }
    try {
      await axios.post(
        'https://developark.duckdns.org/api_wonderland/story/like',
        { storyId },
        { withCredentials: true }
      );
      // 좋아요 후 즉시 반영
      setLocalLikes((prev) => prev + 1);
      if (onLikeUpdate) onLikeUpdate(storyId);
    } catch (error) {
      alert('좋아요에 실패하였습니다.');
    }
  };

  return (
    <div
      className="text-center small"
      style={{ maxWidth: '100%', cursor: 'pointer' }}
    >
      <img
        src={image}
        alt={title}
        className="w-100 rounded mb-2"
        style={{
          aspectRatio: '1 / 1',
          objectFit: 'cover',
          borderRadius: '10px',
        }}
        onClick={handleClick}
      />
      <div className="fw-semibold" onClick={handleClick}>{title}</div>
      <div className="text-muted small">{author}</div>
      <div className="text-secondary" onClick={handleLike}>
        <i className="fas fa-heart text-danger"></i> {localLikes}
      </div>
    </div>
  );
};

export default BookCard;