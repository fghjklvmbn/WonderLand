import React from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';

const SignupPage = () => {
  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card className="p-4 shadow" style={{ width: '100%', maxWidth: '500px' }}>
        <h3 className="text-center mb-4">회원가입</h3>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>이름</Form.Label>
            <Form.Control type="text" placeholder="이름 입력" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>이메일</Form.Label>
            <Form.Control type="email" placeholder="이메일 입력" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>비밀번호</Form.Label>
            <Form.Control type="password" placeholder="비밀번호 입력" />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>비밀번호 확인</Form.Label>
            <Form.Control type="password" placeholder="비밀번호 확인" />
          </Form.Group>
          <Button variant="secondary" type="submit" className="w-100">
            회원가입
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default SignupPage;