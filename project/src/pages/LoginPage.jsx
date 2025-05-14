import React from 'react';
import { useNavigate } from 'react-router-dom'; // 페이지 이동용 hook
import { useAuth } from '../context/AuthContext'; // 로그인 상태 관리를 위한 context
import { Container, Form, Button, Card } from 'react-bootstrap'; // 부트스트랩 컴포넌트 사용

const LoginPage = () => {
  const navigate = useNavigate(); // 페이지 이동 함수
  const { login } = useAuth(); // login 함수 (context에서 제공)

  // 로그인 버튼 눌렀을 때 동작
  const handleSubmit = (e) => {
    e.preventDefault(); // 폼 submit 시 새로고침 방지
    login();            // 로그인 상태 true 처리
    navigate('/');      // 메인 페이지로 이동
  };

  return (
    <main
      style={{
        flex: 1, // 헤더/풋터 사이에서 공간 채우기
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px 20px',
      }}
    >
      <Container className="d-flex justify-content-center align-items-center">
        <Card className="p-5 border-0 w-100" style={{ maxWidth: '600px' }}>
          {/* 제목 및 안내 */}
          <h2 className="text-center fw-bold mb-2">로그인</h2>
          <p className="text-center text-muted mb-4">
            처음 방문하셨습니까?{' '}
            <a href="/SignupPage" className="text-decoration-underline">
              회원가입
            </a>
          </p>

          {/* 로그인 폼 */}
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

            {/* 로그인 버튼 */}
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
