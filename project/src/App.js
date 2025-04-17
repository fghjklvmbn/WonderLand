import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // 필요시 커스텀 CSS

const Header = () => (
  <header className="bg-light py-3 px-4 d-flex justify-content-between align-items-center">
    <div className="d-flex align-items-center gap-2">
      <img src="https://placehold.co/40x40" alt="로고 이미지" />
      <span className="fs-4 fw-bold text-primary">원더랜드</span>
    </div>
    <div className="w-50 position-relative">
      <input type="text" className="form-control rounded-pill ps-4" placeholder="검색어를 입력하세요" />
      <i className="fas fa-search position-absolute top-50 end-0 translate-middle-y pe-3 text-muted"></i>
    </div>
    <button className="btn btn-outline-dark btn-sm">로그인</button>
  </header>
);

const Banner = () => (
  <section className="bg-primary text-white text-center py-5 position-relative">
    <div className="position-absolute top-50 start-0 translate-middle-y fs-2 px-3 cursor-pointer">&#10094;</div>
    <h1 className="display-4 fw-bold">광고판</h1>
    <div className="position-absolute top-50 end-0 translate-middle-y fs-2 px-3 cursor-pointer">&#10095;</div>
    <div className="mt-3 d-flex justify-content-center gap-2">
      <span className="bg-white rounded-circle" style={{ width: 10, height: 10 }}></span>
      <span className="bg-white opacity-50 rounded-circle" style={{ width: 10, height: 10 }}></span>
      <span className="bg-white opacity-50 rounded-circle" style={{ width: 10, height: 10 }}></span>
    </div>
  </section>
);

const CategoryTabs = () => {
  const categories = ['전체', '인기', '동물', '문학', '과학', '역사', '모험', '교훈', '자연'];
  return (
    <nav className="d-flex justify-content-center gap-3 py-4 border-bottom">
      {categories.map((cat, i) => (
        <div
          key={cat}
          className={`text-dark small d-flex align-items-center gap-1 ${i === 1 ? 'fw-bold border-bottom border-2 border-dark' : ''}`}
          role="button"
        >
          <i className="fas fa-star"></i>
          <span>{cat}</span>
        </div>
      ))}
      <button className="btn btn-sm btn-outline-secondary ms-3">Filters</button>
    </nav>
  );
};

const BookCard = ({ image, title, author, likes }) => (
  <div className="text-center small">
    <img src={image} alt={title} className="img-fluid rounded mb-2" />
    <div>{title}</div>
    <div className="text-muted">{author}</div>
    <div><i className="fas fa-heart text-danger"></i> {likes}</div>
  </div>
);

const books = new Array(16).fill(0).map((_, i) => ({
  image: 'https://placehold.co/200x200',
  title: `제목`,
  author: `작가이름`,
  likes: '좋아요 수'
}));

const BookGrid = () => (
  <main className="container py-4">
    <div className="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-4">
      {books.map((book, i) => (
        <div key={i} className="col">
          <BookCard {...book} />
        </div>
      ))}
    </div>
  </main>
);

const App = () => (
  <div>
    <Header />
    <Banner />
    <CategoryTabs />
    <BookGrid />
  </div>
);

export default App;
