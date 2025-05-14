import React, { useEffect, useState } from 'react';
import { Row, Col, Tabs, Tab, Spinner } from 'react-bootstrap';
import BookCard from './BookCard';
import axios from 'axios';

const TabbedBookGrid = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  // 초기 데이터 로딩
  useEffect(() => {
    axios.get('http://localhost:8080/api/stories/shared') // 👉 실제 서버 주소로 바꿔야 함
      .then(res => {
        setStories(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('스토리 로딩 실패:', err);
        setLoading(false);
      });
  }, []);

  // 카드 렌더링 함수
  const renderGrid = () => (
    <Row xs={2} md={3} lg={5} className="g-3 py-4">
      {stories.map((story) => (
        <Col key={story.story_id}>
          <BookCard
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
      <Tabs defaultActiveKey="shared" id="story-tabs" className="mb-3">
        <Tab eventKey="shared" title="🌍 공유된 이야기">
          {loading ? <Spinner animation="border" /> : renderGrid()}
        </Tab>
      </Tabs>
    </div>
  );
};

export default TabbedBookGrid;
