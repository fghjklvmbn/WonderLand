import React from 'react';
import MyLibraryTabs from './MyLibraryTabs';

const MyLibraryPage = () => {
  return (
    <main style={{ minHeight: '100vh', padding: '2rem' }}>
      <h2>내 서재</h2>
      <MyLibraryTabs />
    </main>
  );
};

export default MyLibraryPage;
