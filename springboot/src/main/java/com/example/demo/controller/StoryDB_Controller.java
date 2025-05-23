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

    @PostMapping("/saveOrUpdate")
    public ResponseEntity<?> saveOrUpdateStory(@RequestBody StorySaveRequest request, HttpSession session) {
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

        String textJson;
        try {
            textJson = mapper.writeValueAsString(textJsonObj);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("textJson 변환 실패");
        }

        // 이미 임시 저장된 스토리가 있으면 update, 없으면 insert
        Story existingStory = storyRepository.findFirstByAuthorUserIdAndIsDraftTrue(user.getUserId()).orElse(null);

        if (existingStory != null) {
            existingStory.setTitle(title);
            existingStory.setTextJson(textJson);
            storyRepository.save(existingStory);
            return ResponseEntity.ok("기존 임시 스토리 업데이트 완료");
        }

        // 새로 저장
        Story story = Story.builder()
                .author(user)
                .title(title)
                .textJson(textJson)
                .isDraft(true)
                .isShared(false)
                .build();
        storyRepository.save(story);

        return ResponseEntity.ok("새 스토리 저장 완료");
    }

}
