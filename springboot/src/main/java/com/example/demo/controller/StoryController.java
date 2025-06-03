package com.example.demo.controller;

import com.example.demo.dto.StoryDTO;
import com.example.demo.model.Story;
import com.example.demo.model.User;
import com.example.demo.repository.StoryRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpSession;
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

    // 🔸 공유된 이야기 목록
    @GetMapping("/shared")
    public List<StoryDTO> getSharedStories() {
        List<Story> stories = storyRepository.findByIsSharedTrue();
        return toDtoList(stories);
    }

    // 🔸 장르별 공유된 이야기
    @GetMapping("/genre/{genre}")
    public List<StoryDTO> getStoriesByGenre(@PathVariable String genre) {
        List<Story> stories = storyRepository.findByGenreAndIsSharedTrue(genre);
        return toDtoList(stories);
    }

    // 🔸 최신순 공유된 이야기
    @GetMapping("/latest")
    public List<StoryDTO> getLatestStories() {
        List<Story> stories = storyRepository.findByIsSharedTrueOrderByCreatedAtDesc();
        return toDtoList(stories);
    }

    // 🔸 단일 이야기 상세
    // @GetMapping("/{id}")
    // public ResponseEntity<Map<String, Object>> getStoryById(@PathVariable Long id) {
    //     Optional<Story> optional = storyRepository.findById(id);
    //     if (optional.isEmpty()) return ResponseEntity.notFound().build();

    //     Story story = optional.get();
    //     ObjectMapper mapper = new ObjectMapper();

    //     try {
    //         JsonNode root = mapper.readTree(story.getTextJson());
    //         Map<String, Object> result = new HashMap<>();
    //         result.put("pages", root.get("pages"));
    //         result.put("title", story.getTitle());
    //         return ResponseEntity.ok(result);
    //     } catch (Exception e) {
    //         return ResponseEntity.status(500).body(Map.of("error", "JSON 파싱 실패"));
    //     }
    // }
    // @GetMapping("/{id}")
    // public ResponseEntity<Map<String, Object>> getStoryById(@PathVariable Long id) {
    //     Optional<Story> optional = storyRepository.findById(id);
    //     if (optional.isEmpty()) return ResponseEntity.notFound().build();

    //     Story story = optional.get();
    //     ObjectMapper mapper = new ObjectMapper();

    //     try {
    //         JsonNode textRoot = mapper.readTree(story.getTextJson());
    //         JsonNode selectedRoot = mapper.readTree(story.getSelectedJson());

    //         JsonNode pagesNode = textRoot.path("pages");
    //         List<Map<String, String>> pages = new ArrayList<>();

    //         for (int i = 0; i < pagesNode.size(); i++) {
    //             String text = pagesNode.get(i).asText();
    //             String imageUrl = selectedRoot.path(String.valueOf(i + 1)).asText(); // key는 "1", "2", ...
    //             Map<String, String> page = new HashMap<>();
    //             page.put("text", text);
    //             page.put("image_url", imageUrl);
    //             pages.add(page);
    //         }

    //         Map<String, Object> result = new HashMap<>();
    //         result.put("title", story.getTitle());
    //         result.put("pages", pages);

    //         return ResponseEntity.ok(result);
    //     } catch (Exception e) {
    //         return ResponseEntity.status(500).body(Map.of("error", "JSON 파싱 실패"));
    //     }
    // }
        // @GetMapping("/{id}")
        // public ResponseEntity<Map<String, Object>> getStoryById(@PathVariable Long id) {
        //     Optional<Story> optional = storyRepository.findById(id);
        //     if (optional.isEmpty()) return ResponseEntity.notFound().build();

        //     Story story = optional.get();
        //     ObjectMapper mapper = new ObjectMapper();

        //     try {
        //         JsonNode textRoot = mapper.readTree(story.getTextJson());
        //         JsonNode selectedRoot = mapper.readTree(story.getSelectedJson());

        //         JsonNode pagesNode = textRoot.path("pages");
        //         List<Map<String, String>> pages = new ArrayList<>();

        //         for (int i = 0; i < pagesNode.size(); i++) {
        //             String text = pagesNode.get(i).asText();
        //             String imageUrl = selectedRoot.path(String.valueOf(i + 1)).asText();
        //             Map<String, String> page = new HashMap<>();
        //             page.put("text", text);
        //             page.put("image_url", imageUrl);
        //             pages.add(page);
        //         }

        //         Map<String, Object> result = new HashMap<>();
        //         result.put("title", story.getTitle());
        //         result.put("pages", pages);

        //         // ← 이 줄을 추가하세요!
        //         result.put("selected_json", selectedRoot);

        //         return ResponseEntity.ok(result);
        //     } catch (Exception e) {
        //         return ResponseEntity.status(500).body(Map.of("error", "JSON 파싱 실패"));
        //     }
        // }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getStoryById(@PathVariable Long id) {
        Optional<Story> optional = storyRepository.findById(id);
        if (optional.isEmpty()) return ResponseEntity.notFound().build();

        Story story = optional.get();
        ObjectMapper mapper = new ObjectMapper();

        try {
            JsonNode textRoot = mapper.readTree(story.getTextJson());
            JsonNode selectedRoot = mapper.readTree(story.getSelectedJson());

            JsonNode pagesNode = textRoot.path("pages");
            List<Map<String, String>> pages = new ArrayList<>();

            for (int i = 0; i < pagesNode.size(); i++) {
                String text = pagesNode.get(i).asText().trim();

                // 🔍 빈 텍스트는 건너뛰기
                if (text.isBlank()) continue;

                String imageUrl = selectedRoot.path(String.valueOf(i + 1)).asText();
                Map<String, String> page = new HashMap<>();
                page.put("text", text);
                page.put("image_url", imageUrl);
                pages.add(page);
            }

            Map<String, Object> result = new HashMap<>();
            result.put("title", story.getTitle());
            result.put("pages", pages);
            result.put("selected_json", selectedRoot);  // 표지 이미지용

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "JSON 파싱 실패"));
        }
    }


    // 🔸 ✅ 세션 기반 사용자 이야기 조회
    @GetMapping("/mine")
    public ResponseEntity<?> getMyStories(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(401).body("로그인이 필요합니다.");
        }

        List<Story> stories = storyRepository.findByAuthor_UserId(user.getUserId());
        return ResponseEntity.ok(toDtoList(stories));
    }

    // 🔸 이야기 수정
    @PutMapping("/{id}")
    public ResponseEntity<String> updateStory(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Optional<Story> optional = storyRepository.findById(id);
        if (optional.isEmpty()) return ResponseEntity.notFound().build();

        Story story = optional.get();
        story.setTitle(body.getOrDefault("title", story.getTitle()));
        story.setGenre(body.getOrDefault("genre", story.getGenre()));
        storyRepository.save(story);

        return ResponseEntity.ok("수정 완료");
    }

    // 🔸 이야기 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteStory(@PathVariable Long id) {
        if (!storyRepository.existsById(id)) return ResponseEntity.notFound().build();
        storyRepository.deleteById(id);
        return ResponseEntity.ok("삭제 완료");
    }

    // 🔸 공통: Story 리스트를 DTO 리스트로 변환
    private List<StoryDTO> toDtoList(List<Story> stories) {
        return stories.stream().map(story -> new StoryDTO(
                story.getStoryId(),
                story.getTitle(),
                extractThumbnailFromJson(story.getSelectedJson()),
                getAuthorName(story.getAuthor()),
                story.getGenre(),
                0 // 좋아요 수는 추후 구현
        )).collect(Collectors.toList());
    }

    // 🔸 텍스트 JSON에서 썸네일 추출
    // private String extractThumbnailFromJson(String selected_json) {
    //     try {
    //         ObjectMapper mapper = new ObjectMapper();
    //         JsonNode root = mapper.readTree(selected_json);
    //         return root.path("pages").get(0).path("image_url").asText();
    //     } catch (Exception e) {
    //         return null;
    //     }
    // }
        private String extractThumbnailFromJson(String selected_json) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(selected_json);
            // 첫 번째 키(예: "1")의 값을 가져오기
            Iterator<String> fieldNames = root.fieldNames();
            if (fieldNames.hasNext()) {
                String firstKey = fieldNames.next();
                return root.path(firstKey).asText();
            }
            return null;
        } catch (Exception e) {
            return null;
        }
    }


    // 🔸 작가 이름 추출
    private String getAuthorName(User user) {
        return user.getNickname() != null ? user.getNickname() : user.getName();
    }

    // 🔸 장르별 순위
    @GetMapping("/genres")
    public List<String> getGenresBySharedCount() {
        List<Object[]> rows = storyRepository.findGenreWithSharedStoryCount();
        return rows.stream()
                .map(row -> (String) row[0])
                .collect(Collectors.toList());
    }
}
