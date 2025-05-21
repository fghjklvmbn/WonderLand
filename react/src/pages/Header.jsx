// import React from 'react';
// import { Dropdown } from 'react-bootstrap';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import Logo from '../images/Logo_ver2.0.png';
// import profile from '../images/뚱이.png';
// import { useAuth } from '../context/AuthContext';

// const Header = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { isLoggedIn, logout } = useAuth();

//   const hideExtras = location.pathname === '/login' || location.pathname === '/signup';

//   return (
//     <div className="container">
//       <header
//         style={{ backgroundColor: '#9ED0F3' }}
//         className="py-3 px-4 d-flex justify-content-between align-items-center"
//       >
//         {/* 로고 클릭 시 메인 페이지 이동 */}
//         <Link
//           to="/"
//           className="d-flex align-items-center gap-2 text-decoration-none"
//         >
//           <img src={Logo} alt="로고 이미지" style={{ height: 50 }} />
//           <span style={{ color: '#F2F2F7' }} className="fs-4 fw-bold">
//             원더랜드
//           </span>
//         </Link>

//         {/* 로그인/회원가입 페이지에서는 검색창 숨김 */}
//         {!hideExtras && (
//           <>
//             <div className="w-50 position-relative">
//               <input
//                 type="text"
//                 className="form-control rounded-pill ps-4"
//                 placeholder="검색어를 입력하세요"
//               />
//               <i className="fas fa-search position-absolute top-50 end-0 translate-middle-y pe-3 text-muted"></i>
//             </div>

//             {/* 로그인 여부에 따른 오른쪽 메뉴 */}
//             {isLoggedIn ? (
//               <Dropdown align="end">
//                 <Dropdown.Toggle
//                   variant="light"
//                   id="dropdown-profile"
//                   className="d-flex align-items-center gap-2"
//                 >
//                   <img
//                     src={profile}
//                     alt="프로필"
//                     style={{ height: 25 }}
//                     className="rounded-circle"
//                   />
//                   <span className="d-none d-md-inline">내 서재</span>
//                 </Dropdown.Toggle>
//                 <Dropdown.Menu>
//                   <Dropdown.Item href="/my-library">내 서재 보기</Dropdown.Item>
//                   <Dropdown.Item href="/settings">설정</Dropdown.Item>
//                   <Dropdown.Divider />
//                   <Dropdown.Item onClick={logout}>로그아웃</Dropdown.Item>
//                 </Dropdown.Menu>
//               </Dropdown>
//             ) : (
//               <button
//                 onClick={() => navigate('/login')}
//                 className="btn btn-light fw-bold px-4 rounded-pill"
//               >
//                 로그인
//               </button>
//             )}
//           </>
//         )}
//       </header>
//     </div>
//   );
// };

// export default Header;

// 우빈 추가 코드 테스트 해야함

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

  const hideExtras =
    location.pathname === '/login' || location.pathname === '/register';

  // Write 관련 페이지 여부 확인
  const isWritePage = ['/write', '/write_manual', '/write_ai'].some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <div className="container">
      <header
        style={{ backgroundColor: '#9ED0F3' }}
        className="py-3 px-4 d-flex justify-content-between align-items-center"
      >
        {/* 왼쪽 로고 및 제목 */}
        <Link
          to="/"
          className="d-flex align-items-center gap-2 text-decoration-none"
        >
          <img src={Logo} alt="로고 이미지" style={{ height: 50 }} />
          <span style={{ color: '#F2F2F7' }} className="fs-4 fw-bold">
            원더랜드
          </span>
        </Link>

        {/* 로그인/회원가입 페이지가 아닐 때만 표시 */}
        {!hideExtras && (
          <>
            {/* 중앙 검색창 */}
            <div className="w-50 position-relative">
              <input
                type="text"
                className="form-control rounded-pill ps-4"
                placeholder="검색어를 입력하세요"
              />
              <i className="fas fa-search position-absolute top-50 end-0 translate-middle-y pe-3 text-muted"></i>
            </div>

            {/* 오른쪽: 로그인 상태 */}
            <div className="d-flex align-items-center gap-2">
              {isLoggedIn ? (
                <>
                  {/* 내 서재 드롭다운 */}
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
                      <Dropdown.Item href="/my-library">
                        내 서재 보기
                      </Dropdown.Item>
                      <Dropdown.Item href="/settings">설정</Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item onClick={logout}>로그아웃</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>

                  {/* ✔ Write 페이지일 때만 보이는 버튼 */}
                  {isWritePage && (
                    <>
                      <button
                        className="btn btn-outline-light fw-bold rounded-pill"
                        onClick={() => alert('임시저장 기능 구현 필요')}
                      >
                        임시저장
                      </button>
                      <button
                        className="btn btn-primary fw-bold rounded-pill"
                        onClick={() => alert('다음 단계로 이동')}
                      >
                        다음 단계
                      </button>
                    </>
                  )}
                </>
              ) : (
                // 로그아웃 상태일 때 로그인 버튼
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