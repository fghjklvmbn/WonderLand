import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BookCard = ({ storyId, image, title, author, likes }) => {
  const navigate = useNavigate();
  const [isLoggedIn] = useState(() => sessionStorage.getItem('isLoggedIn'));

   // ✅ async 함수로 변경
  const handleClick = async () => {
      if(isLoggedIn){
        try {
          // 최근 본 작품 기록 API 호출
          await axios.post(
            `https://developark.duckdns.org/api_wonderland/story/recent/${storyId}`,
            {},
            { withCredentials: true }
          );

          // ✅ 성공하면 작품 상세 페이지로 이동
          navigate(`/story/${storyId}`);
        } catch (error) {
          console.error("최근 본 작품 기록 실패:", error);
          // 그래도 상세 페이지로 이동 (API 실패해도 UX 방해 최소화)
          navigate(`/story/${storyId}`);
        }
      }
      else {
        navigate(`/story/${storyId}`);
      }
  };

  return (
    <div
      className="text-center small"
      style={{ maxWidth: '100%', cursor: 'pointer' }}
      onClick={handleClick}
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
      />
      <div className="fw-semibold">{title}</div>
      <div className="text-muted small">{author}</div>
      <div className="text-secondary">
        <i className="fas fa-heart text-danger"></i> {likes}
      </div>
    </div>
  );
};

export default BookCard;
