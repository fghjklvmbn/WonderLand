package com.example.demo.controller;

import com.example.demo.dto.StorySaveRequest;
import com.example.demo.dto.StoryTextJson;
import com.example.demo.model.Story;
import com.example.demo.model.User;
import com.example.demo.repository.StoryRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/story")
@RequiredArgsConstructor
// @CrossOrigin(origins = "http://localhost:3000")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class StoryDB_Controller {

    private final StoryRepository storyRepository;
    private final ObjectMapper mapper = new ObjectMapper();

    @PostMapping("/save")
    public ResponseEntity<?> saveStory(@RequestBody StorySaveRequest request, HttpSession session) {
        // 세션에서 로그인한 사용자 가져오기
        User user = (User) session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(401).body("로그인된 사용자가 없습니다.");
        }

        String title = request.getTitle();
        StoryTextJson textJsonObj = request.getTextJson();

        if (title == null || textJsonObj == null || textJsonObj.getGenre() == null || textJsonObj.getGenre().isEmpty()
                || textJsonObj.getPages() == null || textJsonObj.getPages().isEmpty()) {
            return ResponseEntity.badRequest().body("필수 항목이 누락되었습니다.");
        }

        // textJsonObj를 JSON 문자열로 변환
        String textJson;
        try {
            textJson = mapper.writeValueAsString(textJsonObj);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("textJson 변환 실패");
        }

        // 스토리 저장
        Story story = Story.builder()
                .author(user)
                .title(title)
                .textJson(textJson)
                .isDraft(true)
                .isShared(false)
                .build();

        storyRepository.save(story);

        return ResponseEntity.ok("스토리 저장 성공");
    }
}
