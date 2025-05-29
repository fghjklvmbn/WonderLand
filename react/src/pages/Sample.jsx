import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Pencil, Sparkles } from 'lucide-react'; // 아이콘 (lucide-react 설치 필요)

const WritePage = () => {
  const navigate = useNavigate();

  return (
    <main
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: '50vh' }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={5} className="mb-4">
            <Card className="text-center shadow-sm p-3">
              <div
                className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  backgroundColor: '#cce5ff',
                }}
              >
                <Pencil size={36} color="#007bff" />
              </div>
              <h5 className="fw-bold">모델 학습</h5>
              <p className="text-muted mb-3">
                용태씨 맘대로
                <br />
                그래고 상견례 언제??
              </p>
              <Button
                variant="outline-primary"
                onClick={() => navigate('/write_manual')}
              >
                작성하기
              </Button>
            </Card>
          </Col>
          <Col xs={12} md={5} className="mb-4">
            <Card className="text-center shadow-sm p-3">
              <div
                className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  backgroundColor: '#cce5ff',
                }}
              >
                <Sparkles size={36} color="#007bff" />
              </div>
              <h5 className="fw-bold">AI와 함께 쓰기</h5>
              <p className="text-muted mb-3">
                AI와 동화책 줄거리를 만들어요.
                <br />
                AI를 활용해 글을 쓸 수 있어요.
              </p>
              <Button variant="primary" onClick={() => navigate('/write_ai')}>
                시작하기
              </Button>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default WritePage;
