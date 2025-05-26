import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';

const EditAccountPage = () => {
  const [nickname, setNickname] = useState('');
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.post('http://localhost:8080/mypage/myinfo', {}, { withCredentials: true })
      .then((res) => {
        setNickname(res.data.nickname || '');
      })
      .catch(() => {
        setMessage('사용자 정보를 불러올 수 없습니다.');
      });
  }, []);

  const handleNicknameUpdate = async () => {
    try {
      await axios.put('http://localhost:8080/mypage/nickname', { nickname }, { withCredentials: true });
      setMessage('닉네임이 변경되었습니다.');
    } catch {
      setMessage('닉네임 변경 실패');
    }
  };

  const handlePasswordChange = async () => {
    try {
      await axios.put('http://localhost:8080/mypage/myinfoupdate', passwords, { withCredentials: true });
      setMessage('비밀번호가 변경되었습니다.');
    } catch {
      setMessage('비밀번호 변경 실패');
    }
  };

  return (
    <Container className="py-5" style={{ maxWidth: '600px' }}>
      <Card className="p-4 shadow-sm">
        <h3 className="mb-4">회원 정보 수정</h3>
        {message && <Alert variant="info">{message}</Alert>}

        <Form.Group className="mb-3">
          <Form.Label>닉네임</Form.Label>
          <Form.Control
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <Button onClick={handleNicknameUpdate} className="mt-2">
            닉네임 수정
          </Button>
        </Form.Group>

        <hr />

        <Form.Group className="mb-2">
          <Form.Label>현재 비밀번호</Form.Label>
          <Form.Control
            type="password"
            value={passwords.currentPassword}
            onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>새 비밀번호</Form.Label>
          <Form.Control
            type="password"
            value={passwords.newPassword}
            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
          />
        </Form.Group>
        <Button onClick={handlePasswordChange}>비밀번호 변경</Button>
      </Card>
    </Container>
  );
};

export default EditAccountPage;
