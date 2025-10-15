import React, { useEffect, useState } from 'react';
import { Tabs, Tab, Container, Spinner } from 'react-bootstrap';
import axiosInstance from '../api/axiosInstance';
import MyCreatedStories from './MyCreatedStories';

const voiceService = () => {
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get('/users/me')
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
        
      </Container>
    </div>
  );
};

export default voiceService;
