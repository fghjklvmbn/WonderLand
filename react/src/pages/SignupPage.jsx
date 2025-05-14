// src/pages/SignupPage.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Card } from 'react-bootstrap';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    nickname: '',
    age: '',
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8080/api/users/signup', formData);
      alert(res.data);
    } catch (err) {
      alert('회원가입 실패');
    }
  };

  return (
    <main className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Container style={{ maxWidth: '600px' }}>
        <Card className="p-4">
          <h2 className="mb-3 text-center fw-bold">회원가입</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-2">
              <Form.Label>이메일</Form.Label>
              <Form.Control name="email" type="email" required onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>비밀번호</Form.Label>
              <Form.Control name="password" type="password" required onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>이름</Form.Label>
              <Form.Control name="name" type="text" onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>닉네임</Form.Label>
              <Form.Control name="nickname" type="text" onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>나이</Form.Label>
              <Form.Control name="age" type="number" onChange={handleChange} />
            </Form.Group>
            <Button type="submit" className="w-100 rounded-pill" variant="primary">
              회원가입
            </Button>
          </Form>
        </Card>
      </Container>
    </main>
  );
};

export default SignupPage;
