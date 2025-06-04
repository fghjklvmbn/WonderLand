import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, ListGroup, Form, Modal } from 'react-bootstrap';
import { Plus, Trash2 } from 'lucide-react'; // 플러스 & 휴지통 아이콘
import axios from 'axios'; // API 요청을 위한 axios

const CreateVoiceModel = () => {
  const navigate = useNavigate();
  const [fileList, setFileList] = useState([{ id: 1, file: null }]);
  const [showModal, setShowModal] = useState(false);
  const [modelTitle, setModelTitle] = useState('');

  // 음성 파일 추가 함수
  const addFile = async() => {
    //const response = await axios.get('http://localhost:8080/api/users/me', { withCredentials: true });
    //console.log("test" + response.data.userId);

    const last = fileList[fileList.length - 1];
    if (last && last.file) {
      setFileList([...fileList, { id: fileList.length + 1, file: null }]);
    } else {
      alert('파일을 먼저 선택해주세요.');
    }
  };

  // 음성 파일 변경 함수
  const handleFileChange = (id, file) => {
    if (file) {
      setFileList(
        fileList.map(item => (item.id === id ? { ...item, file } : item))
      );
    }
  };

  // 음성 파일 삭제 함수
  const deleteFile = (id) => {
    if (fileList.length > 1) {
      setFileList(fileList.filter(item => item.id !== id));
    } else {
      alert('최소 하나의 파일은 남아야 합니다.');
    }
  };

  // 모델 생성 버튼 클릭
  const handleCreateModel = () => {
    const allFilesSelected = fileList.every(item => item.file !== null);
    if (!allFilesSelected) {
      alert('음성 파일을 확인해주세요.');
      return;
    }
    setShowModal(true);
  };

  // 모델 제목 제출
  const handleSubmitModel = async () => {
    //추후 데이터베이스에서 해당 이름을 가진 모델이 있는지 없는지 여부 검사해야 함
    if (!modelTitle.trim()) {
      alert('모델 제목을 입력해주세요.');
      return;
    }

    try {
        const healthRes = await axios.get('http://localhost:5000/api/health');
        if (healthRes.data.status !== 'ok') {
        alert('음성 생성 서버와 연결에 실패했습니다. 잠시 뒤 다시 시도해주세요.');
        return;
      }
    } catch (error) {
        console.error('헬스체크 실패:', error);
        alert('서버 연결을 확인하지 못했습니다.');
        return;
    }
    if (fileList.length > 1){
        alert('해당 기능은 준비중입니다.');
    }

    if (!fileList[0].file){
        alert('음성 파일을 확인해주세요.');
        return;
    }

    //FormData 생성
    const formData = new FormData();
    formData.append('model_name', modelTitle);
    formData.append('audio', fileList[0].file);

    const response = await axios.get('http://localhost:8080/api/users/me', { withCredentials: true });
    let userId = response.data.userId;
    //alert("user id" + userId);
    //userId = 1234;

    try{

        /*
        await axios.post(
            'http://localhost:5000/api/model/create',
            formData,
            { headers : { 'Content-Type' : 'multipart/form-data' } }
        );*/

        await axios.post(
          'http://localhost:8080/api/tts-model/create',
          {userId, modelName:modelTitle},
          {headers: {'Content-Type':'application/json'}}
        );

        setShowModal(false);
        setModelTitle('')
        setFileList([{ id: 1, file: null }]);
        navigate('/my-library?tab=voice');
    }catch (error){
        console.error('모델 생성 실패:', error.response || error);
        const msg = error.response?.data?.description || '모델 생성에 실패했습니다.';
        alert(msg);
    }
  };

  return (
    <main className="d-flex align-items-center justify-content-center" style={{ minHeight: '50vh' }}>
      <Container>
        <Row className="justify-content-center mt-4">
          <Col xs={12} md={10} className="text-center">
            <h2 className="fw-bold mb-4">음성 모델 생성</h2>
            <p className="text-muted mb-3">녹음된 음성 파일을 추가하여 음성 모델을 생성하세요.</p>
          </Col>
        </Row>

        <Row className="justify-content-center mt-4">
          <Col xs={12} md={10}>
            <ListGroup>
              {fileList.map(item => (
                <ListGroup.Item
                  key={item.id}
                  className="d-flex justify-content-between align-items-center shadow-sm mb-3"
                  style={{ padding: '20px', borderRadius: '10px' }}
                >
                  <div style={{ flex: 3, marginBottom: '15px', maxWidth: '300px' }}>
                    <strong>음성 파일 {item.id}</strong>
                  </div>
                  <div style={{ flex: 7 }}>
                    <Form.Control
                      type="file"
                      onChange={e => handleFileChange(item.id, e.target.files[0])}
                      accept="audio/*"
                      style={{ marginBottom: '15px', flexBasis: '200px' }}
                    />
                  </div>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => deleteFile(item.id)}
                    className="ms-3"
                    disabled={fileList.length === 1}
                  >
                    <Trash2 size={16} color="#dc3545" />
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
            <Button
              variant="outline-primary"
              className="d-block mx-auto rounded-circle"
              onClick={addFile}
              style={{ width: '60px', height: '60px', padding: 0 }}
            >
              <Plus size={30} color="#007bff" />
            </Button>
          </Col>
        </Row>

        <Row className="justify-content-center mt-4">
          <Col xs={12} md={10} className="text-center">
            <Button
              variant="primary"
              className="px-5 py-3 rounded-pill shadow-lg"
              style={{
                background: 'linear-gradient(to right, #007bff, #00d2ff)',
                border: 'none',
                fontSize: '16px',
                transition: '0.3s',
              }}
              onMouseOver={e => e.target.style.background = '#0056b3'}
              onMouseOut={e => e.target.style.background = 'linear-gradient(to right, #007bff, #00d2ff)'}
              onClick={handleCreateModel}
            >
              음성 모델 생성하기
            </Button>
          </Col>
        </Row>

        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>모델 제목 입력</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="modelTitle">
              <Form.Label>모델 제목</Form.Label>
              <Form.Control
                type="text"
                placeholder="모델 제목을 입력하세요"
                value={modelTitle}
                onChange={e => setModelTitle(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              취소
            </Button>
            <Button variant="primary" onClick={handleSubmitModel}>
              확인
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </main>
  );
};

export default CreateVoiceModel;
