// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 🔹 localStorage에 저장된 로그인 상태 확인
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  // 🔹 로그인 시 상태 저장 및 localStorage 반영
  const login = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  // 🔹 로그아웃 시 상태 초기화 및 localStorage 제거
  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
  };

  // 🔸 새로고침에도 로그인 유지
  useEffect(() => {
    const storedLogin = localStorage.getItem('isLoggedIn') === 'true';
    if (storedLogin) setIsLoggedIn(true);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
