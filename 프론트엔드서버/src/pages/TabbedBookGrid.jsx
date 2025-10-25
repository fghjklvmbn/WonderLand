/*
 * 컨텐츠(책) 정보 그리드(탭 구현)
 * 기여자 : 박경환, 정현호, 정우빈
 * 수정일 : 2025-10-26 03:20
 * 설명 : 책 정보 확인 로직, 최근 본 작품기록 표시 로직, 좋아요 기능 조회로직
*/

import React, { useEffect, useState } from 'react';
import { Row, Col, Tabs, Tab, Spinner } from 'react-bootstrap';
import BookCard from './BookCard';
import axios from 'axios';

const TabbedBookGrid = () => {
  const [latestStories, setLatestStories] = useState([]);
  const [genreStories, setGenreStories] = useState({});
  const [genres, setGenres] = useState([]);
  const [likes, setLikes] = useState({});
  const [activeKey, setActiveKey] = useState('latest');
  const [loading, setLoading] = useState(true);

  // ✅ 좋아요 수 불러오기 함수 (Promise.all로 병렬처리)
  const fetchLikeCounts = async (stories) => {
    const results = await Promise.all(
      stories.map(async (story) => {
        try {
          const res = await axios.get(
            `https://developark.duckdns.org/api_wonderland/story/likeCount/${story.storyId}`
          );
          return { storyId: story.storyId, count: res.data };
        } catch {
          return { storyId: story.storyId, count: 0 };
        }
      })
    );

    setLikes((prev) => {
      const updated = { ...prev };
      results.forEach(({ storyId, count }) => {
        updated[storyId] = count;
      });
      return updated;
    });
  };

  // ✅ 데이터 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const genreRes = await axios.get('https://developark.duckdns.org/api_wonderland/stories/genres');
        setGenres(genreRes.data);

        // 최신 스토리
        const latestRes = await axios.get('https://developark.duckdns.org/api_wonderland/stories/latest');
        setLatestStories(latestRes.data);
        await fetchLikeCounts(latestRes.data);

        // 장르별 스토리
        const genreData = {};
        for (const genre of genreRes.data) {
          const res = await axios.get(`https://developark.duckdns.org/api_wonderland/stories/genre/${genre}`);
          genreData[genre] = res.data;
          await fetchLikeCounts(res.data);
        }
        setGenreStories(genreData);

        setLoading(false);
      } catch (err) {
        console.error('데이터 불러오기 실패:', err);
      }
    };

    fetchData();
  }, []);

  // ✅ 좋아요 후 갱신 콜백
  const handleLikeUpdate = async (storyId) => {
    try {
      const res = await axios.get(
        `https://developark.duckdns.org/api_wonderland/story/likeCount/${storyId}`
      );
      setLikes((prev) => ({ ...prev, [storyId]: res.data }));
    } catch (err) {
      console.error('좋아요 수 갱신 실패:', err);
    }
  };

  const renderGrid = (stories) => (
    <Row xs={2} md={3} lg={5} className="g-3 py-4">
      {stories.map((story) => (
        <Col key={story.storyId}>
          <BookCard
            storyId={story.storyId}
            image={story.image || 'https://developark.duckdns.org/webdav/bucket/imageholder/place.jpg'}
            title={story.title}
            author={story.author}
            likes={likes[story.storyId] ?? 0}
            onLikeUpdate={handleLikeUpdate}
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

      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
          <Spinner animation="border" />
        </div>
      ) : (
        renderGrid(getCurrentStories())
      )}
    </div>
  );
};

export default TabbedBookGrid;