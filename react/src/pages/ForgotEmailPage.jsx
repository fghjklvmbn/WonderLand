import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Card } from 'react-bootstrap';

const ForgotEmailPage = () => {
  const [formData, setFormData] = useState({ name: '', password: '' });
  const [foundEmail, setFoundEmail] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:8080/api/users/find-email',
        formData
      );
      if (res.status === 200) {
        setFoundEmail(res.data); // 백엔드에서 이메일 문자열 반환
      }
    } catch (err) {
      alert(err.response?.data || '이메일 찾기에 실패했습니다.');
    }
  };
  // ✅ 로그인 페이지로 이동하는 핸들러
  const goToLogin = () => {
    navigate('/login');
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
          <h2 className="text-center fw-bold mb-4">이메일 찾기</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">이름</Form.Label>
              <Form.Control
                type="text"
                name="name"
                required
                onChange={handleChange}
                className="rounded-3"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">비밀번호</Form.Label>
              <Form.Control
                type="password"
                name="password"
                required
                onChange={handleChange}
                className="rounded-3"
              />
            </Form.Group>

            <Button
              variant="secondary"
              type="submit"
              className="w-100 rounded-pill py-2"
            >
              이메일 찾기
            </Button>
          </Form>

          {foundEmail && (
            <div className="mt-4 text-center">
              <strong>찾은 이메일 :</strong> {foundEmail}
              <br />
              <br />
              <Button
                variant="secondary"
                className="w-100 rounded-pill py-2"
                onClick={goToLogin} // ✅ 클릭 시 로그인으로 이동
              >
                로그인 이동
              </Button>
            </div>
          )}
        </Card>
      </Container>
    </main>
  );
};

export default ForgotEmailPage;
