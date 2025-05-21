// src/pages/MyLibrary/MyLibraryTabs.jsx
import React from 'react';
import { Tabs, Tab, Container } from 'react-bootstrap';
import MyAccount from './MyAccount';

const MyLibraryTabs = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Container className="py-4 flex-grow-1">
        <h2 className="fw-bold mb-4">내 서재</h2>
        <Tabs defaultActiveKey="recent" id="mylibrary-tabs" className="mb-3">
          <Tab eventKey="account" title="👤 내 계정 설정">
            <MyAccount />
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
};

export default MyLibraryTabs;
