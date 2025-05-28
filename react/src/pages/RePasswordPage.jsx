import React, { useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const RePasswordPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', newPassword: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        // UserController -> reset-password
        'http://localhost:8080/api/users/reset-password',
        formData
      );
      if (res.status === 200) {
        alert('비밀번호가 성공적으로 변경되었습니다.');
        navigate('/login');
      }
    } catch (err) {
      alert(err.response?.data || '비밀번호 변경 실패');
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
          <h2 className="text-center fw-bold mb-4">비밀번호 재설정</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">이메일</Form.Label>
              <Form.Control
                type="email"
                name="email"
                required
                onChange={handleChange}
                className="rounded-3"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">새 비밀번호</Form.Label>
              <Form.Control
                type="password"
                name="newPassword"
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
              비밀번호 재설정
            </Button>
          </Form>
        </Card>
      </Container>
    </main>
  );
};

export default RePasswordPage;
