package com.example.demo.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173") // React 개발 서버 주소
public class StoryController {

    @PostMapping("/generate")
    public String generateStory(@RequestBody PromptRequest prompt) {
        String userPrompt = prompt.getPrompt();

        // 지금은 예시 텍스트. 나중에 여기에 Qwen 붙이기!
        return "📝 사용자 입력: " + userPrompt + "\n\n👶 AI가 만든 동화: 옛날 옛적에...";
    }

    // 요청에서 받은 prompt 데이터를 담을 클래스
    public static class PromptRequest {
        private String prompt;

        public String getPrompt() {
            return prompt;
        }

        public void setPrompt(String prompt) {
            this.prompt = prompt;
        }
    }
}
