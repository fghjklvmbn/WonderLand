import React, { useEffect, useState } from 'react';
import { Tabs, Tab, Container, Spinner } from 'react-bootstrap';
import axiosInstance from '../api/axiosInstance';
import MyCreatedStories from './MyCreatedStories';
import SpeechModelCreate from './SpeechModelCreate';

const MyLibraryTabs = () => {
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get('/api/users/me')
      .then(res => {
        setNickname(res.data.nickname || res.data.name || '사용자');
        setLoading(false);
      })
      .catch(() => {
        setNickname('사용자');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Container className="py-4 flex-grow-1">
        <h2 className="fw-bold mb-2">📚 {nickname}님의 서재</h2>

        <Tabs defaultActiveKey="created" id="mylibrary-tabs" className="mb-3" fill>
          <Tab eventKey="recent" title="📖 최근 본 이야기">
            <p>최근 보어 이어지는 아직 준비 중입니다.</p>
          </Tab>
          <Tab eventKey="created" title="✍️ 내가 만든 이야기">
            <MyCreatedStories />
          </Tab>
          <Tab eventKey="voice" title="🎙️ 내 목소리 학습">
            <SpeechModelCreate />
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
};

export default MyLibraryTabs;
