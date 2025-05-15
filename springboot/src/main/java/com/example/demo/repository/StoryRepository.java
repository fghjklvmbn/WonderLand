package com.example.demo.repository;

import com.example.demo.model.Story;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StoryRepository extends JpaRepository<Story, Long> {
    
    @EntityGraph(attributePaths = "author")
    // 공유된 이야기만 조회
    List<Story> findByIsSharedTrue();
}
