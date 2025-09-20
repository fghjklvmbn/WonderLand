import React, { useState } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';

const StoryCreate = () => {
  const [step, setStep] = useState(1);

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  return (
    <Container className="py-4">
      <Card className="p-4 shadow mx-auto" style={{ maxWidth: '800px' }}>
        <h3 className="text-center mb-4">스토리 생성</h3>
        {step === 1 && (
          <>
            <Form.Group className="mb-3">
              <Form.Label>제목</Form.Label>
              <Form.Control type="text" placeholder="스토리 제목 입력" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>카테고리</Form.Label>
              <Form.Select>
                <option>모험</option>
                <option>동화</option>
                <option>판타지</option>
                <option>SF</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>연령대</Form.Label>
              <Form.Select>
                <option>전체</option>
                <option>8~13세</option>
                <option>13세 이상</option>
              </Form.Select>
            </Form.Group>
            <div className="text-end">
              <Button onClick={handleNext}>다음 단계 ▶</Button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <Form.Group className="mb-3">
              <Form.Label>AI 도움 여부</Form.Label>
              <Form.Check type="radio" label="AI 도움으로 작성" name="ai" />
              <Form.Check type="radio" label="직접 작성" name="ai" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>내용 입력</Form.Label>
              <Form.Control as="textarea" rows={5} placeholder="스토리 내용을 작성하세요..." />
            </Form.Group>
            <div className="d-flex justify-content-between">
              <Button variant="secondary" onClick={handleBack}>◀ 이전</Button>
              <Button variant="primary" onClick={handleNext}>다음 ▶</Button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <p>이미지 생성 또는 음성 설정 등 추가 옵션...</p>
            <div className="d-flex justify-content-between">
              <Button variant="secondary" onClick={handleBack}>◀ 이전</Button>
              <Button variant="success">스토리 완료</Button>
            </div>
          </>
        )}
      </Card>
    </Container>
  );
};

export default StoryCreate;
