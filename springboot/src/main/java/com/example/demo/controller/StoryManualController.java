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
public class StoryManualController {
  private final StoryRepository storyRepository;
private final ObjectMapper objectMapper = new ObjectMapper();

@PostMapping("/write_manualDB")
public ResponseEntity<?> saveManualStory(
        @RequestBody Map<String, Object> request,
        HttpSession session
) {
    // 1. 로그인 사용자 확인
    User user = (User) session.getAttribute("user");
    if (user == null) {
        return ResponseEntity.status(401).body("로그인된 사용자가 없습니다.");
    }

    // 2. 파라미터 추출
    String title = (String) request.get("title");
    String genre = (String) request.get("genre");
    @SuppressWarnings("unchecked")
    Map<String, Object> textJson = (Map<String, Object>) request.get("textJson");

    if (title == null || genre == null || textJson == null) {
        return ResponseEntity.badRequest().body("필수 항목이 누락되었습니다.");
    }

    try {
        // 3. JSON 직렬화
        String textJsonStr = objectMapper.writeValueAsString(textJson);

        // 4. 새로운 Story 저장
        Story story = Story.builder()
                .author(user)
                .title(title)
                .genre(genre)
                .textJson(textJsonStr)
                .selectedJson("{}")
                .isDraft(true)
                .isShared(false)
                .build();
        storyRepository.save(story);

        return ResponseEntity.ok(Map.of(
                "message", "스토리 저장 성공",
                "storyId", story.getStoryId()
        ));
    } catch (Exception e) {
        return ResponseEntity.status(500).body("스토리 저장 중 오류 발생");
    }
}
}