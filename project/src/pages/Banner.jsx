import React, { useState } from 'react';
import { Button } from 'react-bootstrap';

const Banner = () => {
  const banners = ['광고판 1', '광고판 2', '광고판 3'];
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((index - 1 + banners.length) % banners.length);
  const next = () => setIndex((index + 1) % banners.length);

  return (
    <div className="container">
      <section style={{ backgroundColor: "#FFFACD" }} className="text-black text-center py-5 position-relative rounded">
        <Button variant="light" onClick={prev} className="position-absolute top-50 start-0 translate-middle-y px-3">
          &#10094;
        </Button>
        <h1 className="display-4 fw-bold">{banners[index]}</h1>
        <Button variant="light" onClick={next} className="position-absolute top-50 end-0 translate-middle-y px-3">
          &#10095;
        </Button>
        <div className="mt-3 d-flex justify-content-center gap-2">
          {banners.map((_, i) => (
            <span
              key={i}
              className={`rounded-circle ${i === index ? 'bg-black' : 'bg-dark opacity-50'}`}
              style={{ width: 10, height: 10 }}
            ></span>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Banner;
