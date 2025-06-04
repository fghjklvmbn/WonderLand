package com.example.demo.repository;

import com.example.demo.model.Image;
import com.example.demo.model.Story;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImageRepository extends JpaRepository<Image, Long> {
    void deleteByStoryAndPageNumber(Story story, Integer pageNumber);
}
