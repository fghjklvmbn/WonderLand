import { useNavigate } from 'react-router-dom';

const BookCard = ({ storyId, image, title, author, likes }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/story/${storyId}`);
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
