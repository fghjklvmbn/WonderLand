import React, { useEffect, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../images/Logo_ver2.0.png';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();
  const [nickname, setNickname] = useState('');

  const hideExtras =
    location.pathname === '/login' || location.pathname === '/register';

  const isWritePage = ['/write', '/write_manual', '/write_ai'].some((path) =>
    location.pathname.startsWith(path)
  );

  // ✅ 닉네임 불러오기 (POST /mypage/myinfo 로 변경됨)
  useEffect(() => {
    const fetchNickname = async () => {
      try {
        const res = await axios.post(
          'https://developark.duckdns.org/api_wonderland/mypage/myinfo',
          {},
          { withCredentials: true }
        );
        if (res.data && res.data.nickname) {
          setNickname(res.data.nickname);
        }
      } catch (err) {
        console.warn('닉네임 가져오기 실패', err);
      }
    };

    if (isLoggedIn) {
      fetchNickname();
    }
  }, [isLoggedIn]);

  // ✅ 로그아웃
  const handleLogout = async () => {
    try {
      await axios.post(
        'https://developark.duckdns.org/api_wonderland/users/logout',
        {},
        { withCredentials: true }
      );
      logout();
      alert("로그아웃이 되었습니다.");
      navigate('/');
    } catch (err) {
      console.error('로그아웃 실패:', err);
    }
  };

  return (
    <div className="container">
      <header
        style={{ backgroundColor: '#9ED0F3' }}
        className="py-3 px-4 d-flex justify-content-between align-items-center"
      >
        {/* 로고 */}
        <Link
          to="/"
          className="d-flex align-items-center gap-2 text-decoration-none"
        >
          <img src={Logo} alt="로고 이미지" style={{ height: 50 }} />
          <span style={{ color: '#F2F2F7' }} className="fs-4 fw-bold">
            원더랜드
          </span>
        </Link>

        {!hideExtras && (
          <>
            {/* 검색창 */}
            <div className="w-50 position-relative">
              <input
                type="text"
                className="form-control rounded-pill ps-4"
                placeholder="검색어를 입력하세요"
              />
              <i className="fas fa-search position-absolute top-50 end-0 translate-middle-y pe-3 text-muted"></i>
            </div>

            {/* 우측 유저 메뉴 */}
            <div className="d-flex align-items-center gap-2">
              {' '}
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => navigate('/Write')}
                    className="btn btn-light fw-bold px-4 rounded-pill"
                  >
                    글쓰기
                  </button>
                  <Dropdown align="end">
                    <Dropdown.Toggle
                      variant="light"
                      id="dropdown-profile"
                      className="d-flex align-items-center gap-2"
                    >
                      <span className="d-none d-md-inline">{nickname}</span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item as={Link} to="/my-library">
                        내 서재 보기
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to="/mypage">
                        내 계정
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item onClick={handleLogout}>
                        로그아웃
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="btn btn-light fw-bold px-4 rounded-pill"
                >
                  로그인
                </button>
              )}
            </div>
          </>
        )}
      </header>
    </div>
  );
};

export default Header;
