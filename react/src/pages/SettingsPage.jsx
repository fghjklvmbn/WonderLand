// src/pages/SettingsPage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';

const SettingsPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [nickname, setNickname] = useState('');
  const [passwords, setPasswords] = useState({ current: '', newPassword: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/auth/me', { withCredentials: true })
      .then((res) => {
        setUserInfo(res.data);
        setNickname(res.data.nickname || '');
      })
      .catch(() => {
        setMessage('사용자 정보를 불러올 수 없습니다.');
      });
  }, []);

  const handleNicknameUpdate = async () => {
    try {
      await axios.put(
        'http://localhost:8080/api/users/update-nickname',
        { nickname },
        { withCredentials: true }
      );
      setMessage('닉네임이 변경되었습니다.');
    } catch {
      setMessage('닉네임 변경 실패');
    }
  };

  const handlePasswordChange = async () => {
    try {
      await axios.put(
        'http://localhost:8080/api/users/change-password',
        passwords,
        { withCredentials: true }
      );
      setMessage('비밀번호가 변경되었습니다.');
    } catch {
      setMessage('비밀번호 변경 실패');
    }
  };

  return (
    <Container className="py-5" style={{ maxWidth: '600px' }}>
      <Card className="p-4 shadow-sm">
        <h3 className="mb-4">내 계정 설정</h3>

        {message && <Alert variant="info">{message}</Alert>}

        {userInfo && (
          <>
            <div className="mb-3">
              <strong>이메일:</strong> {userInfo.email}
              <br />
              <strong>이름:</strong> {userInfo.name}
            </div>

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
                value={passwords.current}
                onChange={(e) =>
                  setPasswords({ ...passwords, current: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>새 비밀번호</Form.Label>
              <Form.Control
                type="password"
                value={passwords.newPassword}
                onChange={(e) =>
                  setPasswords({ ...passwords, newPassword: e.target.value })
                }
              />
            </Form.Group>
            <Button onClick={handlePasswordChange}>비밀번호 변경</Button>
          </>
        )}
      </Card>
    </Container>
  );
};

export default SettingsPage;
