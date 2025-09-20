package com.example.demo.controller;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@RestController
@RequestMapping("/api/image")
public class ImageGenerationController {

    private static final String IMAGE_URL = "http://localhost:5000/AI/Art/Create";

    @PostMapping("/generate")
    public ResponseEntity<?> generateImages(@RequestBody Map<String, Object> request) {
        try {
            // 1) 요청 파라미터 추출
            String prompt = (String) request.get("prompt");
            Integer seed = request.containsKey("seed") ? (Integer) request.get("seed") : 12345;
            Double cfgScale = request.containsKey("cfg_weight") ? ((Number) request.get("cfg_weight")).doubleValue() : 20.0;
            Double temperature = request.containsKey("temperature") ? ((Number) request.get("temperature")).doubleValue() : 1.0;

            // 2) Flask 서버에 보낼 JSON 구성
            JSONObject sdRequest = new JSONObject();
            sdRequest.put("prompt", prompt);
            sdRequest.put("seed", seed);
            sdRequest.put("cfg_weight", cfgScale);
            sdRequest.put("temperature", temperature);

            // 3) HTTP 요청 전송
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<String> entity = new HttpEntity<>(sdRequest.toString(), headers);

            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.postForEntity(IMAGE_URL, entity, String.class);

            if (!response.getStatusCode().is2xxSuccessful()) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "서버 응답 상태 코드: " + response.getStatusCode()));
            }

            // 4) Flask 응답 JSON 파싱
            JSONObject json = new JSONObject(response.getBody());
            if (!json.optBoolean("status", false)) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", json.optString("detail", "이미지 생성 실패")));
            }

            JSONArray imageArray = json.getJSONArray("image_output");
            List<Map<String, String>> images = new ArrayList<>();

            for (int i = 0; i < imageArray.length(); i++) {
                JSONObject imgObj = imageArray.getJSONObject(i);
                String filename = imgObj.getString("filename");
                String base64Data = imgObj.getString("base64");

                Map<String, String> imageInfo = new HashMap<>();
                imageInfo.put("filename", filename);
                imageInfo.put("base64", base64Data);
                images.add(imageInfo);
            }

            // 5) React 프론트엔드로 응답 반환
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("images", images);

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
