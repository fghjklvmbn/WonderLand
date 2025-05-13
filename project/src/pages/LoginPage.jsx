import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container, Form, Button, Card } from 'react-bootstrap';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(); // 로그인 처리
    navigate('/'); // 메인페이지 이동
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
            <a href="/SignupPage" className="text-decoration-underline">
              회원가입
            </a>
          </p>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">아이디</Form.Label>
              <Form.Control type="text" className="rounded-3" />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label className="fw-semibold">비밀번호</Form.Label>
              <Form.Control type="password" className="rounded-3" />
            </Form.Group>

            <div className="mb-4">
              <a href="/forgot" className="text-dark fw-semibold text-decoration-underline">
                비밀번호를 잊으셨습니까?
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
