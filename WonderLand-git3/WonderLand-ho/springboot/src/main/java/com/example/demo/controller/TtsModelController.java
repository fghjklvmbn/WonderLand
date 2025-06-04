package com.example.demo.controller;

import com.example.demo.dto.TtsModelDTO;
import com.example.demo.model.TtsModel;
import com.example.demo.service.TtsModelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Collections;


import java.util.List;
@CrossOrigin(origins = "http://localhost:3000") 
@RestController
@RequestMapping("/api/tts-model")
public class TtsModelController {

    @Autowired
    private TtsModelService ttsModelService;

    // 모델 생성 API 엔드포인트
    @PostMapping("/create")
    public ResponseEntity<String> createTtsModel(@RequestBody TtsModelDTO ttsModelDTO) {
        try {
            TtsModel ttsModel = ttsModelService.createTtsModel(ttsModelDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body("모델이 성공적으로 생성되었습니다. 모델 ID: " + ttsModel.getId());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("모델 생성에 실패했습니다.");
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<String>> getModelsByUserId(@PathVariable Long userId) {
        try {
            System.out.println("받은 userId: " + userId);  // 받아온 userId 확인
            List<String> models = ttsModelService.getModelsByUserId(userId);

            //List<Long> modelIds = models.stream().map(TtsModel::getId).toList();
            return ResponseEntity.ok(models);
        } catch (Exception e) {
            e.printStackTrace(); // 예외 발생 시 로그 출력
            return ResponseEntity.status(500).body(null);
        }
    }
        @GetMapping("/id/{modelName}")
    public ResponseEntity<Long> getModelIdByName(@PathVariable String modelName) {
        try {
            Long modelId = ttsModelService.getModelIdByName(modelName);
            if (modelId == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
            return ResponseEntity.ok(modelId);
        } catch (Exception e) {
            e.printStackTrace(); // 예외 발생 시 로그 출력
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
