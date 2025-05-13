import React from 'react';
import { Container, Row, Col, Tabs, Tab } from 'react-bootstrap';
import BookCard from './BookCard';

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
        <Tab eventKey="popular" title="🔥 인기">{renderGrid(renderBooks('인기'))}</Tab>
        <Tab eventKey="latest" title="🆕 최신">{renderGrid(renderBooks('최신'))}</Tab>
        <Tab eventKey="recommended" title="🎯 추천">{renderGrid(renderBooks('추천'))}</Tab>
        <Tab eventKey="adventure" title="🗺️ 모험">{renderGrid(renderBooks('모험'))}</Tab>
        <Tab eventKey="fantasy" title="🧙 판타지">{renderGrid(renderBooks('판타지'))}</Tab>
        <Tab eventKey="healing" title="🌿 힐링">{renderGrid(renderBooks('힐링'))}</Tab>
      </Tabs>
    </Container>
  );
};

export default TabbedBookGrid;
