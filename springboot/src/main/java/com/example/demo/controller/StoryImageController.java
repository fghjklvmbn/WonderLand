package com.example.demo.controller;

import com.example.demo.model.Image;
import com.example.demo.model.Story;
import com.example.demo.model.User;
import com.example.demo.repository.ImageRepository;
import com.example.demo.repository.StoryRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.core.type.TypeReference;


@RestController
@RequestMapping("/api/story/image")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class StoryImageController {

    private final StoryRepository storyRepository;
    private final ImageRepository imageRepository;

    @PostMapping("/save")
    public ResponseEntity<?> savePageImages(
            @RequestBody Map<String, Object> request,
            HttpSession session) {

        User user = (User) session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(401).body("로그인된 사용자가 없습니다.");
        }

        try {
            Long storyId = Long.valueOf(request.get("storyId").toString());
            Integer pageNumber = Integer.valueOf(request.get("pageNumber").toString());
            ObjectMapper mapper = new ObjectMapper();
            List<String> imageUrls = mapper.convertValue(request.get("imageUrls"), new TypeReference<List<String>>() {});

            if (storyId == null || pageNumber == null || imageUrls == null || imageUrls.size() != 5) {
                return ResponseEntity.badRequest().body("필수 데이터가 부족하거나 잘못되었습니다.");
            }

            Story story = storyRepository.findById(storyId).orElse(null);
            if (story == null || !story.getAuthor().getUserId().equals(user.getUserId())) {
                return ResponseEntity.status(403).body("스토리를 찾을 수 없거나 권한이 없습니다.");
            }


            // 이미지 5개 저장
            for (String url : imageUrls) {
                Image img = Image.builder()
                        .story(story)
                        .pageNumber(pageNumber)
                        .imageUrl(url)
                        .build();
                imageRepository.save(img);
            }

            return ResponseEntity.ok("이미지 저장 완료");
        } catch (Exception e) {
            e.printStackTrace();  // 실제 에러 로그 확인을 위해 추가
            return ResponseEntity.status(500).body("서버 에러");
        }
    }
        /**
     * 스토리 공유/비공유 토글
     */
    @PatchMapping("/{storyId}/toggle-share")
    public ResponseEntity<?> toggleShare(
            @PathVariable Long storyId,
            @RequestBody Map<String, Boolean> body,
            HttpSession session) {

        User user = (User) session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(401).body("로그인된 사용자가 없습니다.");
        }

        Boolean toShare = body.get("isShared");
        if (toShare == null) {
            return ResponseEntity.badRequest().body("isShared 값을 보내주세요.");
        }

        Story story = storyRepository.findById(storyId).orElse(null);
        if (story == null || !story.getAuthor().getUserId().equals(user.getUserId())) {
            return ResponseEntity.status(403).body("스토리를 찾을 수 없거나 권한이 없습니다.");
        }

        // 공유 상태 업데이트 & 저장
        story.setIsShared(toShare);
        storyRepository.save(story);

        // 변경된 공유 상태를 응답
        return ResponseEntity.ok(Map.of("isShared", story.getIsShared()));
    }
    
}
