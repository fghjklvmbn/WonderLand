import React from 'react';

// 단일 책 카드 컴포넌트
// props로 이미지 URL, 제목, 작가명, 좋아요 수를 받는다
const BookCard = ({ image, title, author, likes }) => (
  <div
    className="text-center small"
    style={{ maxWidth: '100%' }} // 카드 전체 너비 제한 (부모에 따라 조정됨)
  >
    {/* 책 이미지 */}
    <img
      src={image}
      alt={title}
      className="w-100 rounded mb-2" // 전체 너비, 둥근 모서리, 아래 여백
      style={{
        aspectRatio: '1 / 1',        // 정사각형 비율 유지
        objectFit: 'cover',          // 이미지 비율 유지한 채 채움
        borderRadius: '10px'         // 둥글게
      }}
    />

    {/* 책 제목 */}
    <div className="fw-semibold">{title}</div>

    {/* 작가 이름 */}
    <div className="text-muted small">{author}</div>

    {/* 좋아요 수 */}
    <div className="text-secondary">
      <i className="fas fa-heart text-danger"></i> {likes}
    </div>
  </div>
);

export default BookCard;
