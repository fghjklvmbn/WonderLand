import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './pages/Header';
import Footer from './pages/Footer';
import MainPage from './pages/MainPage';
import MyLibraryTabs from './pages/MyLibraryTabs';
import StoryDetailPage from './pages/StoryDetailPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { AuthProvider } from './context/AuthContext'; // ✅ 추가

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App = () => {
  return (
    <Router>
      <AuthProvider> {/* ✅ 로그인 상태 관리 추가 */}
        <div className="d-flex flex-column min-vh-100">
          <Header />

          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/my-library" element={<MyLibraryTabs />} />
              <Route path="/story/:id" element={<StoryDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/SignupPage" element={<SignupPage />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
