import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // URL 파라미터(id)를 받아오기 위해 사용
import sampleStory from '../data/sampleStory.json'; // 샘플 데이터 임포트
import { Button, Row, Col } from 'react-bootstrap'; // 부트스트랩 UI 컴포넌트 사용

const StoryDetailPage = () => {
  // URL에서 전달받은 스토리 ID
  const { id } = useParams();

  // 전체 스토리 데이터를 저장할 상태
  const [story, setStory] = useState([]);

  // 현재 페이지 인덱스 상태
  const [pageIndex, setPageIndex] = useState(0);

  // 컴포넌트 마운트 시 스토리 데이터를 상태에 저장
  useEffect(() => {
    setStory(sampleStory); // 실제 서비스에서는 여기서 id로 DB에서 불러오는 로직을 넣게 됨
  }, [id]);

  // 로딩 중일 때 출력
  if (story.length === 0) return <div>Loading...</div>;

  // 현재 페이지의 이미지와 텍스트 정보
  const current = story[pageIndex];

  // 음성 재생 (TTS URL 기반)
  const playTTS = () => {
    const audio = new Audio(current.tts_url);
    audio.play();
  };

  // 다음 페이지로 이동
  const nextPage = () => {
    if (pageIndex < story.length - 1) setPageIndex(pageIndex + 1);
  };

  // 이전 페이지로 이동
  const prevPage = () => {
    if (pageIndex > 0) setPageIndex(pageIndex - 1);
  };

  return (
    // 전체 화면을 중앙 정렬하고 padding을 가진 메인 콘텐츠
    <main
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '30px 20px',
      }}
    >
      {/* 이미지 + 텍스트 레이아웃을 좌우로 나누는 Row */}
      <Row
        className="shadow border rounded bg-white w-100"
        style={{
          maxWidth: '1300px',
          minHeight: '600px',
          padding: '30px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* 왼쪽: 이미지 영역 */}
        <Col
          md={6}
          className="d-flex justify-content-center align-items-center"
          style={{ height: '100%' }}
        >
          <img
            //src={'https://placehold.co/800x800'}
            src={'current.image_url'}
            alt={`page-${pageIndex + 1}`}
            className="img-fluid rounded"
            style={{ maxHeight: '100%', objectFit: 'contain' }}
          />
        </Col>

        {/* 오른쪽: 텍스트 영역 */}
        <Col
          md={6}
          className="d-flex flex-column justify-content-center"
          style={{ height: '100%' }}
        >
          <div style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
            {current.text}
          </div>
        </Col>
      </Row>

      {/* 페이지 이동 버튼 (이전 / 다음) */}
      <div className="text-center my-3">
        <Button
          variant="secondary"
          onClick={prevPage}
          disabled={pageIndex === 0} // 첫 페이지면 이전 버튼 비활성화
        >
          ◀ 이전
        </Button>{' '}
        <span className="mx-3">
          Page {pageIndex + 1} / {story.length}
        </span>
        <Button
          variant="secondary"
          onClick={nextPage}
          disabled={pageIndex === story.length - 1} // 마지막 페이지면 다음 버튼 비활성화
        >
          다음 ▶
        </Button>
      </div>

      {/* 음성 듣기 버튼 - 화면 오른쪽 아래 고정 */}
      <Button
        variant="primary"
        onClick={playTTS}
        style={{
          position: 'fixed',
          bottom: '80px',
          right: '30px',
          zIndex: 9999,
          borderRadius: '50px',
          padding: '12px 20px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
        }}
      >
        🔊 음성 듣기
      </Button>
    </main>
  );
};

export default StoryDetailPage;
