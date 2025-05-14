import React from 'react';
// 메인 상단 배너 컴포넌트 (슬라이드 형식 광고/소개용)
import Banner from './Banner';
// 탭 기반 도서 목록 그리드 (인기, 최신, 추천 등)
import TabbedBookGrid from './TabbedBookGrid';

// 메인 페이지 컴포넌트
const MainPage = () => (
  <>
    {/* 상단 배너 영역 */}
    <Banner />
    {/* 도서 목록 탭 영역 */}
    <TabbedBookGrid />
  </>
);

export default MainPage;
