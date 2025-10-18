/*
 * 헤더
 * 기여자 : 박경환, 정우빈, 정현호
 * 수정일 : 2025-10-19 00:10
 * 설명 : 세션 기반 로그인 상태 확인, 사용자 이메일 표시, 세션 자동 연장 (5분)
*/

import { useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../images/Logo_ver2.0.png';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, extendSession, checkSession } = useAuth();
  const isLoggedIn = sessionStorage.getItem('isLoggedIn');
  const hideExtras =
    location.pathname === '/login' || location.pathname === '/register';

  // ✅ 로그인 상태 확인 및 사용자 이메일 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (checkSession) {

      } else {
        alert("로그인 정보가 만료되었습니다. 다시 로그인 해주세요")
        logout();
        navigate('/');
      }
    };

    if (isLoggedIn) fetchUserInfo();
  }, [isLoggedIn, logout, navigate]);

  // ✅ 세션 자동 연장 (4분 40초마다)
  // 로그아웃 코드 주입
  useEffect(() => {
    if (!isLoggedIn) return;
    extendSession();
    const interval = setInterval(extendSession, 5 * 58 * 1000); // 5분 타이머 -> 함수실행
    return () => clearInterval(interval);
  }, [isLoggedIn, logout, navigate]);

  // ✅ 로그아웃
  const handleLogout = async () => {
    try {
      await axios.post(
        'https://developark.duckdns.org/api_wonderland/users/logout',
        {},
        { withCredentials: true }
      );
      logout();
      alert('로그아웃 되었습니다.');
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
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => navigate('/write')}
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
                      <span className="d-none d-md-inline">
                        {sessionStorage.getItem('nickname') || '사용자'}
                      </span>
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