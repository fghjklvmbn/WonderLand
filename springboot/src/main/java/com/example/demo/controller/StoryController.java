package com.example.demo.controller;

import com.example.demo.dto.StoryDTO;
import com.example.demo.model.Story;
import com.example.demo.model.User;
import com.example.demo.repository.StoryRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/stories")
@CrossOrigin(origins = "http://localhost:3000")
public class StoryController {

    @Autowired
    private StoryRepository storyRepository;

    /**
     * 공유된 이야기 목록 전체 조회 (기본 탭)
     */
    @GetMapping("/shared")
    public List<StoryDTO> getSharedStories() {
        List<Story> stories = storyRepository.findByIsSharedTrue();
        return toDtoList(stories);
    }

    /**
     * 장르별 공유된 이야기 조회
     */
    @GetMapping("/genre/{genre}")
    public List<StoryDTO> getStoriesByGenre(@PathVariable String genre) {
        List<Story> stories = storyRepository.findByGenreAndIsSharedTrue(genre);
        return toDtoList(stories);
    }

    /**
     * 최신순 공유된 이야기 조회
     */
    @GetMapping("/latest")
    public List<StoryDTO> getLatestStories() {
        List<Story> stories = storyRepository.findByIsSharedTrueOrderByCreatedAtDesc();
        return toDtoList(stories);
    }

    /**
     * 단일 이야기 상세 조회 (pages 반환용)
     */
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getStoryById(@PathVariable Long id) {
        Optional<Story> optional = storyRepository.findById(id);
        if (optional.isEmpty()) return ResponseEntity.notFound().build();

        Story story = optional.get();
        ObjectMapper mapper = new ObjectMapper();

        try {
            JsonNode root = mapper.readTree(story.getTextJson());
            Map<String, Object> result = new HashMap<>();
            result.put("pages", root.get("pages"));
            result.put("title", story.getTitle());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "JSON 파싱 실패"));
        }
    }

    /**
     * 사용자 자신의 생성 이야기 목록 조회
     */
    @GetMapping("/mine")
    public List<StoryDTO> getMyStories(@RequestParam Long userId) {
        List<Story> stories = storyRepository.findByAuthor_UserId(userId);
        return stories.stream().map(story -> new StoryDTO(
            story.getStoryId(),
            story.getTitle(),
            story.getTextJson() != null ? extractThumbnailFromJson(story.getTextJson()) : null,
            getAuthorName(story.getAuthor()),
            story.getGenre(),
            0 // 좋아요 수 추후 구현
        )).collect(Collectors.toList());
    }

    /**
     * 공통: Story 리스트를 DTO 리스트로 변환
     */
    private List<StoryDTO> toDtoList(List<Story> stories) {
        return stories.stream().map(story -> new StoryDTO(
                story.getStoryId(),
                story.getTitle(),
                extractThumbnailFromJson(story.getTextJson()),
                getAuthorName(story.getAuthor()),
                story.getGenre(),
                0 // 좋아요 수는 추후 구현
        )).collect(Collectors.toList());
    }

    /**
     * 텍스트 JSON에서 썸네일 이미지 추출 (첫 페이지의 image_url)
     */
    private String extractThumbnailFromJson(String textJson) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(textJson);
            return root.path("pages").get(0).path("image_url").asText();
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * 작가 이름: 닉네임 우선, 없으면 이름
     */
    private String getAuthorName(User user) {
        return user.getNickname() != null ? user.getNickname() : user.getName();
    }

    /**
     * 장르 목록 (스토리 수 기준 정렬)
     */
    @GetMapping("/genres")
    public List<String> getGenresBySharedCount() {
        List<Object[]> rows = storyRepository.findGenreWithSharedStoryCount();
        return rows.stream()
                .map(row -> (String) row[0])
                .collect(Collectors.toList());
    }
}
