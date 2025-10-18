import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Container, Form, Button, Card } from 'react-bootstrap';

const LoginPage = () => {
  const { login } = useAuth();
  const [ formData, setFormData ] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      login(formData);
    } catch (err) {
      // 그 외 오류
      alert('로그인 실패: 서버 연결이 실패하였습니다.');
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
