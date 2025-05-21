import React, { useEffect, useState } from 'react';
import { Tabs, Tab, Container } from 'react-bootstrap';
import MyCreatedStories from './MyCreatedStories';
import MyAccount from './MyAccount';
import axios from 'axios';

const MyLibraryTabs = () => {
  const [nickname, setNickname] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/auth/me', { withCredentials: true }) // ✅ 세션 쿠키 포함 요청
      .then((res) => {
        const name = res.data.nickname || res.data.name;
        setNickname(name);
      })
      .catch(() => setNickname('사용자'));
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Container className="py-4 flex-grow-1">
        <h2 className="fw-bold mb-2">내 서재</h2>
        <p>👋 {nickname} 님, 환영합니다!</p>

        <Tabs defaultActiveKey="created" id="mylibrary-tabs" className="mb-3">
          <Tab eventKey="created" title="✍️ 내가 만든 이야기">
            <MyCreatedStories />
          </Tab>
          <Tab eventKey="account" title="👤 내 계정 설정">
            <MyAccount />
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
};

export default MyLibraryTabs;
