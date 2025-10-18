// src/context/AuthContext.jsx
/*
 * Auth 관련 설정 및 함수 설정
 * 기여자 : 박경환, 정우빈, 정현호
 * 수정일 : 2025-10-17 23:40
 * 설명 : 세션 기반 로그인 상태 확인, 사용자 이메일 표시, 세션 자동 연장 (5분) 기능 유도 및 함수 정의
*/

import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => sessionStorage.getItem('isLoggedIn') === 'true');
  const [nickname, setNickname] = useState('');
  const navigate = useNavigate();

  // 로그인 처리
  const login = async (formData) => {

    try{
      const res = await axios.post(
        'https://developark.duckdns.org/api_wonderland/users/login',
        formData,
        {
          withCredentials: true,
        }
      );

      // OK 시
      if (res.data.status === "success") {
        alert(`로그인이 되었습니다! 안녕하세요 ${res.data.data.nickname} 님`);
        sessionStorage.setItem('isLoggedIn', true);
        sessionStorage.setItem('nickname', res.data.data.nickname);
        navigate('/');
      } 
    } catch (err) {
      if (err.response) {
        // 서버가 응답했을 때 (HTTP 상태 코드 존재)
        if (err.response.status === 400) {
          alert(err.response.data.message);
          logout();
          // navigate('/');
        } else if (err.response.status === 401) {
          alert(err.response.data.message);
        } else {
          alert(`로그인 실패: ${err.response.status}`);
        }
      } else {
        // 네트워크 오류 등
        alert("서버와 연결할 수 없습니다.");
      }
    }
  };

  // 로그아웃 처리
  const logout = async () => {
    try {
      await axios.post('https://developark.duckdns.org/api_wonderland/users/logout', {}, { withCredentials: true });
    } catch (err) {
      console.error('서버 로그아웃 실패:', err);
    } finally {
      setIsLoggedIn(false);
      setNickname('');
      sessionStorage.clear();
    }
  };

  // 세션 확인
  const checkSession = async () => {
    if (isLoggedIn) {
      try {
        const res = await axios.get(
          'https://developark.duckdns.org/api_wonderland/session/check',
          { withCredentials: true }
        );

        // ✅ 백엔드에서 active: true를 반환하면 세션 유지 중
        if (res.status === 200 && res.data.active) {
          setIsLoggedIn(true);
          sessionStorage.setItem('isLoggedIn', true);
        } else {
          setIsLoggedIn(false);
          sessionStorage.removeItem('isLoggedIn');
        }
      } catch (err) {
        console.error('세션 확인 중 에러 발생:', err);
        // ✅ 401 등 에러 발생 시 세션 만료 처리
        setIsLoggedIn(false);
        sessionStorage.removeItem('isLoggedIn');

        // 서버에서 보낸 메시지 표시
        if (err.response?.data?.message) {
          alert(err.response.data.message);
        } else {
          alert('세션 확인 중 문제가 발생했습니다.');
        }
      }
    }
  };

  const extendSession = async () => {
    try {
      const res = await axios.post(
        'https://developark.duckdns.org/api_wonderland/session/refresh',
        {},
        { withCredentials: true }
      );
      if (res.status === 200) {
        console.log('세션 연장 성공:', new Date().toLocaleTimeString());
      }
    } catch (err) {
      if (err.response?.status === 401) {
        console.warn('세션 만료됨. 자동 로그아웃.');
        logout();
        navigate('/');
      } else {
        console.error('세션 연장 실패:', err);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, nickname, login, logout, extendSession, checkSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);