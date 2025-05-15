import React, { useEffect, useState } from 'react';
import { Row, Col, Tabs, Tab, Spinner } from 'react-bootstrap';
import BookCard from './BookCard';
import axios from 'axios';

const TabbedBookGrid = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [genres, setGenres] = useState([]);

  // 이야기 데이터 가져오기
  useEffect(() => {
    axios.get('http://localhost:8080/api/stories/shared')
      .then(res => {
        const data = res.data;
        setStories(data);

        // 장르 목록 중복 제거
        const uniqueGenres = [...new Set(data.map(story => story.genre))];
        setGenres(uniqueGenres);

        setLoading(false);
      })
      .catch(err => {
        console.error('스토리 로딩 실패:', err);
        setLoading(false);
      });
  }, []);

  // 카드 그리드 렌더링 함수
  const renderGrid = (genre) => (
    <Row xs={2} md={3} lg={5} className="g-3 py-4">
      {stories
        .filter((story) => story.genre === genre)
        .map((story) => (
          <Col key={story.storyId}>
            <BookCard
              storyId={story.storyId}
              image={story.thumbnail}
              title={story.title}
              author={story.author}
              likes={story.likes}
            />
          </Col>
        ))}
    </Row>
  );

  return (
    <div className="container py-4">
      <Tabs defaultActiveKey={genres[0]} id="genre-tabs" className="mb-3">
        {loading ? (
          <Spinner animation="border" />
        ) : (
          genres.map((genre) => (
            <Tab eventKey={genre} title={`📚 ${genre}`} key={genre}>
              {renderGrid(genre)}
            </Tab>
          ))
        )}
      </Tabs>
    </div>
  );
};

export default TabbedBookGrid;
