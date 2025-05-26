package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/story")
public class StoryGenerate {

    @PostMapping("/story_generate")
    public ResponseEntity<Map<String, Object>> generateStory(@RequestBody Map<String, Object> request) {
        // 요청 파라미터: createpage, story_progression
        String createpage = (String) request.get("createpage");
        String storyProgression = (String) request.get("story_progression");

        // createpage 값을 정수로 변환 (기본 5페이지)
        int pageCount = 5;
        try {
            pageCount = Integer.parseInt(createpage);
        } catch (Exception e) {
            // 변환 실패 시 기본값 유지
        }

        // story_progression 내용을 활용해서 페이지별 텍스트 생성
        // 여기서는 예시로 더미 텍스트 생성
        List<Map<String, Object>> pagesText = new ArrayList<>();

        for (int i = 1; i <= pageCount; i++) {
            String text = "";
            switch (i) {
                case 1:
                    text = "에르델 마법의 숲에서 사계절이 동시에 존재하는 정령들이 살고 있습니다. 봄 정령, 여름 정령, 가을 정령, 겨울 정령은 각각의 능력을 가지고 있습니다.";
                    break;
                case 2:
                    text = "어느 날, 숲에서 이상한 일이 일어났습니다. 정령들은 이를 해결하기 위해 모여들었지만 서로 다른 의견으로 갈등이 시작되었습니다.";
                    break;
                case 3:
                    text = "정령들은 각자의 입장을 고집하며 서로의 의견을 존중하지 않았고, 갈등은 점점 커져만 갔습니다.";
                    break;
                case 4:
                    text = "하지만 시간이 지나면서 서로의 의견을 듣고 이해하려 노력했고, 함께 문제를 해결하는 방법을 찾아냈습니다.";
                    break;
                case 5:
                    text = "정령들은 이를 통해 더욱 친밀해지고, 각자의 능력을 발전시키며 숲을 더욱 아름답게 가꾸어나갔습니다.";
                    break;
                default:
                    text = "이야기의 새로운 장면이 펼쳐집니다.";
            }
            pagesText.add(Map.of(
                    "number", i,
                    "text", text
            ));
        }

        Map<String, Object> response = new HashMap<>();
        response.put("pages_text", pagesText);

        return ResponseEntity.ok(response);
    }
}
