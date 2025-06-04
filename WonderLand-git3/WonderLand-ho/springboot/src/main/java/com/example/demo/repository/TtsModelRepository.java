package com.example.demo.repository;

import com.example.demo.model.TtsModel;
import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TtsModelRepository extends JpaRepository<TtsModel, Long> {

    // User 객체를 기준으로 모델 목록 조회
    List<TtsModel> findByUser(User user);
    TtsModel findByModelName(String modelName);
}
