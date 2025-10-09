import React, { useEffect, useState } from 'react';
import { Row, Col, Tabs, Tab, Spinner } from 'react-bootstrap';
import BookCard from './BookCard';
import axios from 'axios';

const TabbedBookGrid = () => {
  const [latestStories, setLatestStories] = useState([]);
  const [genreStories, setGenreStories] = useState({});
  const [genres, setGenres] = useState([]);
  const [activeKey, setActiveKey] = useState('latest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 장르 리스트 가져오기
    axios.get('https://developark.duckdns.org/api_wonderland/stories/genres').then((res) => {
      setGenres(res.data);
      res.data.forEach((genre) => {
        axios
          .get(`https://developark.duckdns.org/api_wonderland/stories/genre/${genre}`)
          .then((res) => {
            setGenreStories((prev) => ({ ...prev, [genre]: res.data }));
          });
      });
    });

    // 최신 스토리 가져오기
    axios.get('https://developark.duckdns.org/api_wonderland/stories/latest').then((res) => {
      setLatestStories(res.data);
      setLoading(false);
    });
  }, []);

  // ─── 스토리 그리드 렌더링 ───
  const renderGrid = (stories) => (
    <Row xs={2} md={3} lg={5} className="g-3 py-4">
      {stories.map((story) => (
        <Col key={story.storyId}>
          <BookCard
            storyId={story.storyId}
            image={story.image || 'https://developark.duckdns.org/webdav/bucket/imageholder/place.jpg'}
            title={story.title}
            author={story.author}
            likes={story.likes}
          />
        </Col>
      ))}
    </Row>
  );

  const getCurrentStories = () => {
    if (activeKey === 'latest') return latestStories;
    return genreStories[activeKey] || [];
  };

  return (
    <div className="container py-4">
      <Tabs
        id="story-tabs"
        activeKey={activeKey}
        onSelect={(k) => setActiveKey(k)}
        className="mb-3"
      >
        <Tab eventKey="latest" title="🕓 최신순" />
        {genres.map((genre) => (
          <Tab key={genre} eventKey={genre} title={genre} />
        ))}
      </Tabs>

      {/* ─── 로딩 오버레이 ─── */}
      {loading && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <Spinner animation="border" variant="light" />
        </div>
      )}

      {/* ─── 스토리 그리드 ─── */}
      {!loading && renderGrid(getCurrentStories())}
    </div>
  );
};

export default TabbedBookGrid;