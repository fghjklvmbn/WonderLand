package com.example.demo.service;

import com.example.demo.dto.TtsModelDTO;
import com.example.demo.model.TtsModel;
import com.example.demo.model.User;
import com.example.demo.repository.TtsModelRepository;
import com.example.demo.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TtsModelService {

    @Autowired
    private TtsModelRepository ttsModelRepository;

    @Autowired
    private UserRepository userRepository;

    public TtsModel createTtsModel(TtsModelDTO ttsModelDTO) {
        // User 객체를 userId로 가져옴
        User user = userRepository.findById(ttsModelDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // User 객체와 모델 이름으로 TtsModel 생성
        TtsModel ttsModel = new TtsModel(ttsModelDTO.getModelName(), user);

        return ttsModelRepository.save(ttsModel);
    }

    public List<String> getModelsByUserId(Long userId) {
        // userId로 User 객체를 찾음
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // User 객체를 기준으로 모델 목록 조회
        List<TtsModel> models = ttsModelRepository.findByUser(user);

        return models.stream()
                .map(TtsModel::getModelName)
                .collect(Collectors.toList());
    }
        public Long getModelIdByName(String modelName) {
        TtsModel model = ttsModelRepository.findByModelName(modelName);
        if (model != null) {
            return model.getId();
        }
        return null; // 모델이 없으면 null 반환
    }
}
