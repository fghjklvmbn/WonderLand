import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../images/Logo_ver2.0.png';
import profile from '../images/뚱이.png';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  const hideExtras = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="container">
      <header
        style={{ backgroundColor: '#9ED0F3' }}
        className="py-3 px-4 d-flex justify-content-between align-items-center"
      >
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
            <div className="w-50 position-relative">
              <input
                type="text"
                className="form-control rounded-pill ps-4"
                placeholder="검색어를 입력하세요"
              />
              <i className="fas fa-search position-absolute top-50 end-0 translate-middle-y pe-3 text-muted"></i>
            </div>

            {isLoggedIn ? (
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="light"
                  id="dropdown-profile"
                  className="d-flex align-items-center gap-2"
                >
                  <img
                    src={profile}
                    alt="프로필"
                    style={{ height: 25 }}
                    className="rounded-circle"
                  />
                  <span className="d-none d-md-inline">내 서재</span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href="/my-library">내 서재 보기</Dropdown.Item>
                  <Dropdown.Item href="/settings">설정</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={logout}>로그아웃</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="btn btn-light fw-bold px-4 rounded-pill"
              >
                로그인
              </button>

            )}
          </>
        )}
      </header>
    </div>
  );
};

export default Header;
