// import React, { useEffect, useState } from 'react';
// import { Row, Col, Tabs, Tab, Spinner } from 'react-bootstrap';
// import BookCard from './BookCard';
// import axios from 'axios';

// const TabbedBookGrid = () => {
//   const [latestStories, setLatestStories] = useState([]);
//   const [genreStories, setGenreStories] = useState({});
//   const [genres, setGenres] = useState([]);
//   const [activeKey, setActiveKey] = useState('latest');
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // 장르를 공유된 이야기 개수 기준으로 가져오기
//     axios.get('http://localhost:8080/api/stories/genres').then((res) => {
//       setGenres(res.data);
//       res.data.forEach((genre) => {
//         axios
//           .get(`http://localhost:8080/api/stories/genre/${genre}`)
//           .then((res) => {
//             setGenreStories((prev) => ({ ...prev, [genre]: res.data }));
//           });
//       });
//     });

//     // 최신순 스토리 가져오기
//     axios.get('http://localhost:8080/api/stories/latest').then((res) => {
//       setLatestStories(res.data);
//       setLoading(false);
//     });
//   }, []);

//   const renderGrid = (stories) => (
//     <Row xs={2} md={3} lg={5} className="g-3 py-4">
//       {stories.map((story) => (
//         <Col key={story.storyId}>
//           <BookCard
//             storyId={story.storyId}
//             image={story.thumbnail}
//             title={story.title}
//             author={story.author}
//             likes={story.likes}
//           />
//         </Col>
//       ))}
//     </Row>
//   );

//   const getCurrentStories = () => {
//     if (activeKey === 'latest') return latestStories;
//     return genreStories[activeKey] || [];
//   };

//   return (
//     <div className="container py-4">
//       <Tabs
//         id="story-tabs"
//         activeKey={activeKey}
//         onSelect={(k) => setActiveKey(k)}
//         className="mb-3"
//       >
//         <Tab eventKey="latest" title="🕓 최신순" />
//         {genres.map((genre) => (
//           <Tab key={genre} eventKey={genre} title={genre} />
//         ))}
//       </Tabs>

//       {loading ? (
//         <Spinner animation="border" />
//       ) : (
//         renderGrid(getCurrentStories())
//       )}
//     </div>
//   );
// };

// export default TabbedBookGrid;
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
    // 장르를 공유된 이야기 개수 기준으로 가져오기
    axios.get('http://localhost:8080/api/stories/genres').then((res) => {
      setGenres(res.data);
      res.data.forEach((genre) => {
        axios
          .get(`http://localhost:8080/api/stories/genre/${genre}`)
          .then((res) => {
            setGenreStories((prev) => ({ ...prev, [genre]: res.data }));
          });
      });
    });

    // 최신순 스토리 가져오기
    axios.get('http://localhost:8080/api/stories/latest').then((res) => {
      setLatestStories(res.data);
      setLoading(false);
    });
  }, []);


  const renderGrid = (stories) => (
    <Row xs={2} md={3} lg={5} className="g-3 py-4">
      {stories.map((story) => (
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
        <Spinner animation="border" />
      ) : (
        renderGrid(getCurrentStories())
      )}
    </div>
  );
};

export default TabbedBookGrid;
