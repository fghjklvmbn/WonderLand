import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container, Form, Button, Card } from 'react-bootstrap';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:8080/api/auth/login',
        formData,
        {
          withCredentials: true,
        }
      );

      // 백엔드에서 200 OK만 반환될 때만 로그인 성공
      if (res.status === 200 && res.data === '로그인 성공') {
        alert('로그인 성공');
        login(); // context 로그인 처리
        navigate('/');
      }
    } catch (err) {
      // status가 401일 경우 여기로 떨어짐
      alert('로그인 실패: 아이디 또는 비밀번호를 확인하세요.');
    }
  };

  return (
    <main
      style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px 20px',
      }}
    >
      <Container className="d-flex justify-content-center align-items-center">
        <Card className="p-5 border-0 w-100" style={{ maxWidth: '600px' }}>
          <h2 className="text-center fw-bold mb-2">로그인</h2>
          <p className="text-center text-muted mb-4">
            처음 방문하셨습니까?{' '}
            <a href="/signup" className="text-decoration-underline">
              회원가입
            </a>
          </p>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">이메일</Form.Label>
              <Form.Control
                type="text"
                name="email"
                required
                onChange={handleChange}
                className="rounded-3"
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label className="fw-semibold">비밀번호</Form.Label>
              <Form.Control
                type="password"
                name="password"
                required
                onChange={handleChange}
                className="rounded-3"
              />
            </Form.Group>
            <div className="mb-4">
              <a
                href="/forgot"
                className="text-dark fw-semibold text-decoration-underline"
              >
                이메일 찾기
              </a>
            </div>

            <div className="mb-4">
              <a
                href="/Re"
                className="text-dark fw-semibold text-decoration-underline"
              >
                비밀번호 재생성
              </a>
            </div>

            <Button
              variant="secondary"
              type="submit"
              className="w-100 rounded-pill py-2"
            >
              로그인
            </Button>
          </Form>
        </Card>
      </Container>
    </main>
  );
};

export default LoginPage;
