import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Form, Button, Card } from 'react-bootstrap';

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    nickname: '',
    age: '',
    phone_number: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('📤 회원가입 전송 데이터:', formData); // 👉 확인용 로그
    try {
      const res = await axios.post(
        'https://developark.duckdns.org/api_wonderland/users/signup',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            withCredentials: true,
          },
        }
      );
      alert(res.data); // 백엔드 응답 메시지
      navigate('/login');
    } catch (err) {
      console.error('❌ 회원가입 오류:', err);
      alert('회원가입 실패');
    }
  };

  return (
    <main
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: '100vh' }}
    >
      <Container style={{ maxWidth: '600px' }}>
        <Card className="p-4">
          <h2 className="mb-3 text-center fw-bold">회원가입</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-2">
              <Form.Label className="fw-semibold">이메일</Form.Label>
              <Form.Control
                name="email"
                type="email"
                required
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label className="fw-semibold">비밀번호</Form.Label>
              <Form.Control
                name="password"
                type="password"
                required
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label className="fw-semibold">이름</Form.Label>
              <Form.Control name="name" type="text" onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label className="fw-semibold">닉네임</Form.Label>
              <Form.Control
                name="nickname"
                type="text"
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label className="fw-semibold">휴대폰 번호</Form.Label>
              <Form.Control
                name="phone_number"
                type="text"
                inputMode="numeric" // 모바일 키패드 숫자 전용으로
                pattern="[0-9]*" // 숫자만 허용
                maxLength={11} // 최대 길이 제한 (예: 01012345678)
                value={formData.phone_number}
                onChange={(e) => {
                  // 숫자 이외는 무시
                  const onlyNums = e.target.value.replace(/\D/g, '');
                  setFormData((prev) => ({
                    ...prev,
                    phone_number: onlyNums,
                  }));
                }}
                required
                placeholder="01012345678"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">나이</Form.Label>
              <Form.Control name="age" type="number" onChange={handleChange} />
            </Form.Group>
            <Button
              type="submit"
              className="w-100 rounded-pill"
              variant="primary"
            >
              회원가입
            </Button>
          </Form>
        </Card>
      </Container>
    </main>
  );
};

export default SignupPage;
