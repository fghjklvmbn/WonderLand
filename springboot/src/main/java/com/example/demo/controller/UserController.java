package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000") // React 포트 기준
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

    @PostMapping("/login")
    public String login(@RequestBody User loginUser) {
        User user = userRepository.findByEmail(loginUser.getEmail()).orElse(null);
        if (user == null || !user.getPassword().equals(loginUser.getPassword())) {
            return "이메일 또는 비밀번호가 일치하지 않습니다.";
        }
        return "로그인 성공";
    }

    @PostMapping("/logout")
    public String logout() {
        return "로그아웃 성공";
    }
}
