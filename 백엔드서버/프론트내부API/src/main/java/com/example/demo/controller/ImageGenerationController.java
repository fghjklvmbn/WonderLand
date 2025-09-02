package com.example.demo.controller;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.nio.file.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api/image")
public class ImageGenerationController {

    // **Gradio predict URL** (Stable Diffusion WebUI가 실행 중이어야 함)
    private static final String GRADIO_URL = "http://127.0.0.1:7860/run/predict";
    // **클라이언트가 접근할 때 사용할 static 폴더 경로** (Spring Boot 설정에서 resources/static/output 으로 매핑)
    private static final String STATIC_OUTPUT_DIR = "C:\\Users\\Public\\Documents\\ESTsoft\\CreatorTemp\\gradio";
    // private static final String STATIC_OUTPUT_DIR = "src/main/resources/static/output";

    @PostMapping("/generate")
    public ResponseEntity<?> generateImages(@RequestBody Map<String, Object> request) {
        try {
            // 1) 요청으로 받은 prompt, seed, cfg_scale, temperature 추출
            String prompt = (String) request.get("prompt");
            // 만약 클라이언트에서 seed, cfg_scale, temperature를 넘기지 않는다면 디폴트 값을 지정할 수 있음
            Integer seed = request.containsKey("seed") ? (Integer) request.get("seed") : 42;
            Double cfgScale = request.containsKey("cfg_scale") ? ((Number) request.get("cfg_scale")).doubleValue() : 7.0;
            Double temperature = request.containsKey("temperature") ? ((Number) request.get("temperature")).doubleValue() : 0.7;

            // 2) Gradio /run/predict 에 보낼 JSON 페이로드 구성
            JSONObject sdRequest = new JSONObject();
            // data: [ prompt, seed, cfg_scale, temperature ]
            JSONArray dataArr = new JSONArray();
            dataArr.put(prompt);
            dataArr.put(seed);
            dataArr.put(cfgScale);
            dataArr.put(temperature);
            sdRequest.put("data", dataArr);
            sdRequest.put("fn_index", 2);
            // session_hash는 Gradio 버전에 따라 필수/선택이 다를 수 있음
            sdRequest.put("session_hash", UUID.randomUUID().toString());

            // 3) RestTemplate으로 Gradio에 요청
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<String> entity = new HttpEntity<>(sdRequest.toString(), headers);

            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.postForEntity(GRADIO_URL, entity, String.class);
            if (!response.getStatusCode().is2xxSuccessful()) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "Gradio 응답 상태 코드: " + response.getStatusCode()));
            }

            // 4) Gradio가 반환한 JSON에서 'name' 필드(파일 경로) 목록을 꺼내기
            JSONObject json = new JSONObject(response.getBody());
            // Gradio 1.구조: { data: [ [ {name, data, is_file}, {...}, ... ] ], ... }
            //           실제 이미지 배열은 data.getJSONArray(0) 안에 JSONArray 형태로 들어옴
            JSONArray outerData = json.getJSONArray("data");
            if (outerData.isEmpty()) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "Gradio 응답의 'data'가 비어 있음"));
            }
            // 첫 번째 항목(배열) 안에 다시 이미지 객체 배열이 존재
            JSONArray fileObjs = outerData.getJSONArray(0);

            // 5) 각 파일 경로마다 base64 디코딩이 아닌, 파일을 복사해서 Spring static 폴더로 옮기기
            //    (혹은 직접 base64 디코딩 → 저장 후 URL 반환해도 됨)
            //    이번 예시에서는 Gradio 임시 폴더에 생성된 .png 파일들을
            //    src/main/resources/static/output 폴더로 복사하여 웹서버에서 서빙할 수 있게 처리
            Files.createDirectories(Paths.get(STATIC_OUTPUT_DIR)); // 디렉토리 없으면 생성

            List<String> publicUrls = new ArrayList<>();

            for (int i = 0; i < fileObjs.length(); i++) {
                JSONObject imgObj = fileObjs.getJSONObject(i);
                // "name"="C:\\Users\\Public\\...\\image.png"
                String sourcePath = imgObj.getString("name");
                // is_file이 true인 경우 실제 파일이 존재함
                boolean isFile = imgObj.getBoolean("is_file");
                if (!isFile) {
                    // 만약 base64 data가 들어오면(예: imgObj.getString("data")에 base64) → 직접 디코딩 가능
                    continue;
                }

                // 5-1) 원본 파일 존재 여부 확인
                Path src = Paths.get(sourcePath);
                if (!Files.exists(src)) {
                    continue;
                }

                // 5-2) Spring static/output/ 폴더 안에 “타임스탬프_인덱스.png” 형태로 복사
                String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
                String filename = String.format("gen_%s_%02d.png", timestamp, i);
                Path dest = Paths.get(STATIC_OUTPUT_DIR, filename);
                Files.copy(src, dest, StandardCopyOption.REPLACE_EXISTING);

                // 5-3) 웹에서 접근 가능한 public URL 경로 저장 (예: http://localhost:8080/output/{filename})
                String publicUrl = "/" + filename;
                publicUrls.add(publicUrl);
            }

            // 6) 클라이언트(React)에 이미지 URL 리스트 반환
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("imageUrls", publicUrls);

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
