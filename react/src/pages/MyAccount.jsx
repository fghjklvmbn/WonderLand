import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import axios from 'axios';

const MyAccount = () => {
  const [user, setUser] = useState({ name: '', nickname: '', email: '' });
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8080/api/user/info')
      .then(res => setUser(res.data))
      .catch(() => setError('사용자 정보를 불러오지 못했습니다.'));
  }, []);

  const handleUserUpdate = () => {
    axios.put('http://localhost:8080/api/user/update', user)
      .then(() => setMessage('정보가 수정되었습니다.'))
      .catch(() => setError('정보 수정에 실패했습니다.'));
  };

  const handlePasswordChange = () => {
    if (passwords.new !== passwords.confirm) {
      setError('새 비밀번호가 일치하지 않습니다.');
      return;
    }
    axios.put('http://localhost:8080/api/user/password', passwords)
      .then(() => setMessage('비밀번호가 변경되었습니다.'))
      .catch(() => setError('비밀번호 변경에 실패했습니다.'));
  };

  return (
    <Container className="py-4">
      <h3>내 계정 설정</h3>
      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form>
        <Form.Group className="mb-3">
          <Form.Label>이름</Form.Label>
          <Form.Control value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>닉네임</Form.Label>
          <Form.Control value={user.nickname} onChange={(e) => setUser({ ...user, nickname: e.target.value })} />
        </Form.Group>

        <Button variant="primary" onClick={handleUserUpdate}>정보 수정</Button>
      </Form>

      <hr />

      <Form>
        <h5>비밀번호 변경</h5>
        <Form.Group className="mb-2">
          <Form.Label>현재 비밀번호</Form.Label>
          <Form.Control type="password" onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>새 비밀번호</Form.Label>
          <Form.Control type="password" onChange={(e) => setPasswords({ ...passwords, new: e.target.value })} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>새 비밀번호 확인</Form.Label>
          <Form.Control type="password" onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} />
        </Form.Group>
        <Button variant="warning" onClick={handlePasswordChange}>비밀번호 변경</Button>
      </Form>
    </Container>
  );
};

export default MyAccount;