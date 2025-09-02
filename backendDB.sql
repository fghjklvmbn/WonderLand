CREATE DATABASE wonderland DEFAULT CHARACTER SET utf8mb4;

USE wonderland;
show tables;
	
select * from User; 
SELECT * FROM Story ORDER BY story_id DESC;
select * from Image ORDER BY created_at DESC;
select * from Image order by id DESC;
SELECT * FROM Story ORDER BY created_at DESC;


delete from Story where author_id = 9;

DELETE FROM Story;
DELETE FROM user;
DELETE FROM Image;
drop table User;
drop table Story;



CREATE TABLE User (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    nickname VARCHAR(255),
    age INT NOT NULL,
    join_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    token_balance INT DEFAULT 10,
    phone_number VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


ALTER TABLE User ADD phone_number VARCHAR(20) NOT NULL;


select * from user;

select * from Story;

select * from Image;
DESCRIBE image;

-- Story 테이블 생성 (author_id는 BIGINT로 User.user_id와 일치)
CREATE TABLE Story (
  story_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  author_id BIGINT NOT NULL,
  title VARCHAR(200),
  genre VARCHAR(50),
  text_json JSON,
  selected_json JSON,
  is_draft BOOLEAN DEFAULT TRUE,
  is_shared BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES User(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- updated_at이 변경되지 않아 DATETIME -> TIMESTAMP 로 바꿈
ALTER TABLE Story
MODIFY updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

desc Story;
desc User;
delete from Story;

select * from Story order by created_at desc;

SELECT story_id, title, created_at FROM story ORDER BY created_at DESC LIMIT 5;

CREATE TABLE Image (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    story_id BIGINT NOT NULL,
    page_number INT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    url VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    FOREIGN KEY (story_id) REFERENCES Story(story_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE Image DROP COLUMN image;


desc Image;
desc Story;

