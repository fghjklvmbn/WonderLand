import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container, Form, Button, Card } from 'react-bootstrap';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ context에 로그인 상태 저장
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8080/api/users/login', formData);
      if (res.data === '로그인 성공') {
        login();       // ✅ 로그인 상태 true
        navigate('/'); // ✅ 메인 페이지로 이동
      } else {
        alert(res.data); // 예: 이메일/비밀번호 오류 메시지
      }
    } catch (err) {
      alert('로그인 실패');
      console.error(err);
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
        <Card className="p-5 border-0 shadow w-100" style={{ maxWidth: '600px' }}>
          {/* ✅ 제목 및 안내 영역 복원 */}
          <h2 className="text-center fw-bold mb-2">로그인</h2>
          <p className="text-center text-muted mb-4">
            처음 방문하셨습니까?{' '}
            <a href="/signup" className="text-decoration-underline fw-semibold">
              회원가입
            </a>
          </p>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">이메일</Form.Label>
              <Form.Control
                type="email"
                name="email"
                className="rounded-3"
                placeholder="이메일을 입력하세요"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">비밀번호</Form.Label>
              <Form.Control
                type="password"
                name="password"
                className="rounded-3"
                placeholder="비밀번호를 입력하세요"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <div className="mb-4 text-end">
              <a href="/forgot" className="text-dark fw-semibold text-decoration-underline">
                비밀번호를 잊으셨습니까?
              </a>
            </div>

            {/* ✅ 원래 스타일의 버튼 재현 */}
            <Button
              variant="secondary"
              type="submit"
              className="w-100 rounded-pill py-2 fw-semibold"
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
