package com.example.demo.controller;

import org.json.JSONObject;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.io.FileOutputStream;
import java.io.OutputStream;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.Map;

@RestController
public class ImageGenerationController {

    @PostMapping("/generate")
    public ResponseEntity<?> generateImage(@RequestBody Map<String, String> request) {
        try {
            String prompt = request.get("promt");  // ✅ 수정된 올바른 Java 문법
        
            // Stable Diffusion에 보낼 요청 구성
            JSONObject sdRequest = new JSONObject();
            sdRequest.put("prompt", prompt);
            sdRequest.put("steps", 20);
            sdRequest.put("width", 512);
            sdRequest.put("height", 512);
            sdRequest.put("cfg_scale", 7);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<String> entity = new HttpEntity<>(sdRequest.toString(), headers);

            // 로컬에서 실행 중인 SD API URL
            String sdApiUrl = "http://127.0.0.1:7860/sdapi/v1/txt2img";

            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.postForEntity(sdApiUrl, entity, String.class);

            // 응답에서 base64 이미지 추출
            JSONObject json = new JSONObject(response.getBody());
            String base64Image = json.getJSONArray("images").getString(0);

            // 이미지 저장 경로 지정 (static/output 폴더)
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
            String filename = "generated-" + timestamp + ".png";
            Path outputPath = Paths.get("src/main/resources/static/output", filename);

            // base64 → 바이너리로 디코딩해서 저장
            byte[] decodedImage = Base64.getDecoder().decode(base64Image);
            Files.write(outputPath, decodedImage);

            // 클라이언트에게 접근 가능한 URL 경로만 전달
            return ResponseEntity.ok(Map.of("path", "output/" + filename));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}





/*
package com.example.demo;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class ImageGenerationController {

    // ModelsLab API 엔드포인트 (클라우드 API)
    private final String API_URL = "https://api.modelslab.com/generate";

    // 🔐 여기에 실제 ModelsLab API 키 넣기 (Bearer 토큰 형식)
    private final String API_KEY = "Bearer YOUR_API_KEY_HERE";

    // 현재는 사용하지 않음. 추후 클라우드 기반 배포 시 사용 가능
    @PostMapping("/generate-image")
    public ResponseEntity<?> generateImage(@RequestBody StableDiffusionRequest request) {
        try {
            RestTemplate restTemplate = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", API_KEY);

            HttpEntity<StableDiffusionRequest> entity = new HttpEntity<>(request, headers);

            ResponseEntity<StableDiffusionResponse> response = restTemplate.exchange(
                    API_URL,
                    HttpMethod.POST,
                    entity,
                    StableDiffusionResponse.class
            );

            return ResponseEntity.ok(response.getBody());

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
*/
