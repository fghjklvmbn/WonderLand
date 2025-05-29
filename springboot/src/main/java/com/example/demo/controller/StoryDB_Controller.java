package com.example.demo.controller;

import com.example.demo.model.Story;
import com.example.demo.model.User;
import com.example.demo.repository.StoryRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/story")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class StoryDB_Controller {

    private final StoryRepository storyRepository;
    private final ObjectMapper mapper = new ObjectMapper();

    @PostMapping("/create")
    public ResponseEntity<?> createStory(
            @RequestBody Map<String, Object> request,
            HttpSession session
    ) {
        // 1) 로그인 사용자 체크
        User user = (User) session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(401).body("로그인된 사용자가 없습니다.");
        }

        // 2) 필수 데이터 추출
        String title = (String) request.get("title");
        String genre = (String) request.get("genre");

        
        // pages는 String 배열 또는 리스트 형태로 넘어온다고 가정
        Object pagesObj = request.get("pages");

        @SuppressWarnings("unchecked")
        Map<String, String> selectedImages = (Map<String, String>) request.get("selectedImages");

        if (title == null || genre == null || pagesObj == null || selectedImages == null) {
            return ResponseEntity.badRequest().body("필수 항목이 누락되었습니다.");
        }

        // 3) pagesObj를 JSON 문자열로 변환(text_json 저장용)
        String textJsonStr;
        try {
            textJsonStr = mapper.writeValueAsString(Map.of("pages", pagesObj));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("pages 변환 실패");
        }

        // 4) selectedImages를 JSON 문자열로 변환(selected_json 저장용)
        String selectedJsonStr;
        try {
            selectedJsonStr = mapper.writeValueAsString(selectedImages);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("selectedImages 변환 실패");
        }

        // 5) Story 엔티티 생성 후 저장
        Story story = Story.builder()
                .author(user)
                .title(title)
                .genre(genre)
                .textJson(textJsonStr)       // pages JSON 문자열
                .selectedJson(selectedJsonStr) // 선택된 이미지 JSON 문자열
                .isDraft(true)
                .isShared(false)
                .build();

        storyRepository.save(story);

        return ResponseEntity.ok(Map.of("message", "스토리 저장 완료","storyId", story.getStoryId()));
        
    }
        @PatchMapping("/{storyId}/toggle-share")
        public ResponseEntity<?> toggleShareStatus(
                @PathVariable Long storyId,
                HttpSession session
        ) {
            User user = (User) session.getAttribute("user");
            if (user == null) {
                return ResponseEntity.status(401).body("로그인이 필요합니다.");
            }

            Story story = storyRepository.findById(storyId).orElse(null);
            if (story == null || !story.getAuthor().getUserId().equals(user.getUserId())) {
                return ResponseEntity.status(403).body("수정 권한이 없습니다.");
            }

            // 현재 값의 반대로 설정
            story.setIsShared(!story.getIsShared());
            storyRepository.save(story);

            return ResponseEntity.ok(Map.of("message", "공유 상태 변경 완료", "isShared", story.getIsShared()));
        }

}
