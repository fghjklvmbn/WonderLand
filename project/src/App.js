import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Header from './pages/Header';
import Footer from './pages/Footer';
import { Tabs, Tab, Container, Row, Col, Button } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MyLibraryTabs from './pages/MyLibraryTabs';

const Banner = () => {
  const banners = ['광고판 1', '광고판 2', '광고판 3'];
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((index - 1 + banners.length) % banners.length);
  const next = () => setIndex((index + 1) % banners.length);

  return (
    <div className="container">
      <section style={{backgroundColor : "#FFFACD"}} className="text-black text-center py-5 position-relative rounded">
        <Button variant="light" onClick={prev} className="position-absolute top-50 start-0 translate-middle-y px-3">
          &#10094;
        </Button>
        <h1 className="display-4 fw-bold">{banners[index]}</h1>
        <Button variant="light" onClick={next} className="position-absolute top-50 end-0 translate-middle-y px-3">
          &#10095;
        </Button>
        <div className="mt-3 d-flex justify-content-center gap-2">
          {banners.map((_, i) => (
            <span
              key={i}
              className={`rounded-circle ${i === index ? 'bg-black' : 'bg-dark opacity-50'}`}
              style={{ width: 10, height: 10 }}
            ></span>
          ))}
        </div>
      </section>
    </div>
  );
};

const BookCard = ({ image, title, author, likes }) => (
  <div className="text-center small" style={{ maxWidth: '100%' }}>
    <img src={image} alt={title} className="w-100 rounded mb-2" style={{ aspectRatio: '1 / 1', objectFit: 'cover', borderRadius: '10px' }} />
    <div className="fw-semibold">{title}</div>
    <div className="text-muted small">{author}</div>
    <div className="text-secondary"><i className="fas fa-heart text-danger"></i> {likes}</div>
  </div>
);

const TabbedBookGrid = () => {
  const renderBooks = (label) => new Array(30).fill(0).map((_, i) => ({
    image: 'https://placehold.co/300x300',
    title: `${label} ${i + 1}`,
    author: `작가 ${i + 1}`,
    likes: 50 + i
  }));

  const renderGrid = (books) => (
    <Row xs={2} md={3} lg={5} className="g-3 py-4">
      {books.map((book, i) => (
        <Col key={i}>
          <BookCard {...book} />
        </Col>
      ))}
    </Row>
  );

  return (
    <Container className="py-4">
      <Tabs defaultActiveKey="popular" id="story-tabs" className="mb-3">
        <Tab eventKey="popular" title="🔥 인기">
          {renderGrid(renderBooks('인기'))}
        </Tab>
        <Tab eventKey="latest" title="🆕 최신">
          {renderGrid(renderBooks('최신'))}
        </Tab>
        <Tab eventKey="recommended" title="🎯 추천">
          {renderGrid(renderBooks('추천'))}
        </Tab>
        <Tab eventKey="adventure" title="🗺️ 모험">
          {renderGrid(renderBooks('모험'))}
        </Tab>
        <Tab eventKey="fantasy" title="🧙 판타지">
          {renderGrid(renderBooks('판타지'))}
        </Tab>
        <Tab eventKey="healing" title="🌿 힐링">
          {renderGrid(renderBooks('힐링'))}
        </Tab>
      </Tabs>
    </Container>
  );
};

const MainPage = () => (
  <>
    <Header />
    <Banner />
    <TabbedBookGrid />
    <Footer />
  </>
);

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/my-library" element={<MyLibraryTabs />} />
    </Routes>
  </Router>
);

export default App;
