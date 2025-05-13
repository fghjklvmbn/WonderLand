import React from 'react';

const BookCard = ({ image, title, author, likes }) => (
  <div className="text-center small" style={{ maxWidth: '100%' }}>
    <img src={image} alt={title} className="w-100 rounded mb-2" style={{ aspectRatio: '1 / 1', objectFit: 'cover', borderRadius: '10px' }} />
    <div className="fw-semibold">{title}</div>
    <div className="text-muted small">{author}</div>
    <div className="text-secondary"><i className="fas fa-heart text-danger"></i> {likes}</div>
  </div>
);

export default BookCard;
