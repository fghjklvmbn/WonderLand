import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // 라우팅 기능
import Header from './pages/Header';          // 공통 헤더
import Footer from './pages/Footer';          // 공통 푸터
import MainPage from './pages/MainPage';      // 메인 홈 페이지
import MyLibraryTabs from './pages/MyLibraryTabs'; // 내 서재 페이지 (탭 구성)
import StoryDetailPage from './pages/StoryDetailPage'; // 동화 상세 보기
import LoginPage from './pages/LoginPage';    // 로그인 페이지
import SignupPage from './pages/SignupPage';  // 회원가입 페이지
import { AuthProvider } from './context/AuthContext'; // 로그인 상태 관리 컨텍스트

// 부트스트랩 CSS 및 전역 스타일
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// 전체 애플리케이션 루트 컴포넌트
const App = () => {
  return (
    // 라우터로 전체 앱 감싸기
    <Router>
      {/* 로그인 상태를 앱 전역에서 사용할 수 있도록 AuthProvider로 감쌈 */}
      <AuthProvider>
        {/* flexbox로 레이아웃 구성: 헤더/푸터 제외한 부분을 최소 화면 높이 채우도록 */}
        <div className="d-flex flex-column min-vh-100">
          
          {/* 공통 상단 헤더 */}
          <Header />

          {/* 메인 콘텐츠 라우팅 영역 */}
          <main className="flex-grow-1">
            <Routes>
              {/* 메인 페이지 */}
              <Route path="/" element={<MainPage />} />

              {/* 내 서재 (탭 구성) */}
              <Route path="/my-library" element={<MyLibraryTabs />} />

              {/* 스토리 상세 보기 (id는 URL 파라미터로 전달됨) */}
              <Route path="/story/:id" element={<StoryDetailPage />} />

              {/* 로그인 / 회원가입 페이지 */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} /> {/* ✅ URL 경로는 소문자로 유지 */}
            </Routes>
          </main>

          {/* 공통 하단 푸터 */}
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
