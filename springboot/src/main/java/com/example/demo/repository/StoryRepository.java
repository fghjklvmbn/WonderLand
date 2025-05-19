package com.example.demo.repository;

import com.example.demo.model.Story;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StoryRepository extends JpaRepository<Story, Long> {

    // 공유된 이야기만 조회
    @EntityGraph(attributePaths = "author")
    List<Story> findByIsSharedTrue();

    // 장르별 공유된 이야기 조회
    @EntityGraph(attributePaths = "author")
    List<Story> findByGenreAndIsSharedTrue(String genre);

    // 최신순 공유된 이야기 조회
    @EntityGraph(attributePaths = "author")
    List<Story> findByIsSharedTrueOrderByCreatedAtDesc();

    // 🔥 장르 목록 중복 제거
    @Query("SELECT DISTINCT s.genre FROM Story s WHERE s.isShared = true")
    List<String> findDistinctGenres();

    @Query("SELECT s.genre AS genre, COUNT(s) AS count FROM Story s WHERE s.isShared = true GROUP BY s.genre ORDER BY count DESC")
    List<Object[]> findGenreWithSharedStoryCount();

    

}
