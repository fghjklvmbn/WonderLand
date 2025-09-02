import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Card, Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // ✅ 로그아웃용 context 사용

const MyAccountPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { logout } = useAuth(); // ✅ 로그아웃 함수

  useEffect(() => {
    axios.post('http://localhost:8080/mypage/myinfo', {}, { withCredentials: true })
      .then((res) => {
        setUserInfo(res.data);
      })
      .catch((err) => {
        console.error('유저 정보 조회 실패:', err);
        setMessage('사용자 정보를 불러올 수 없습니다.');
      });
  }, []);

  // ✅ 회원 탈퇴 처리
  const handleUnregister = async () => {
    const confirmDelete = window.confirm('정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.');
    if (!confirmDelete) return;

    try {
      await axios.delete('http://localhost:8080/mypage/unregister', {
        data: {},
        withCredentials: true,
      });
      logout(); // context 상태 정리
      alert('회원 탈퇴가 완료되었습니다.');
      navigate('/login');
    } catch (err) {
      console.error('회원 탈퇴 실패:', err);
      alert('회원 탈퇴 중 오류가 발생했습니다.');
    }
  };

  return (
    <Container className="py-5" style={{ maxWidth: '600px' }}>
      <Card className="p-4 shadow-sm">
        <h3 className="mb-4">내 계정</h3>
        {message && <Alert variant="danger">{message}</Alert>}
        {userInfo && (
          <>
            <div className="mb-3">
              <strong>이메일:</strong> {userInfo.email} <br />
              <strong>이름:</strong> {userInfo.name} <br />
              <strong>닉네임:</strong> {userInfo.nickname}
            </div>
            <div className="d-flex gap-2">
              <Button variant="primary" onClick={() => navigate('/mypage/myinfoupdate')}>
                회원 정보 수정
              </Button>
              <Button variant="danger" onClick={handleUnregister}>
                회원 탈퇴
              </Button>
            </div>
          </>
        )}
      </Card>
    </Container>
  );
};

export default MyAccountPage;
