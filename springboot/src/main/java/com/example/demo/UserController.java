package com.example.demo;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000") // React와 포트 다를 경우 필요
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/signup")
    public String signup(@RequestBody User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            return "이미 등록된 이메일입니다.";
        }
        userRepository.save(user);
        return "회원가입 성공";
    }
}
