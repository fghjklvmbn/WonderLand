package com.example.demo.controller;

import com.example.demo.dto.LoginRequest;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo.dto.UserInfoResponse;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true") // ✅ 세션 쿠키 공유 허용
public class AuthController {

    private final UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpSession session) {
        return userRepository.findByEmail(request.getEmail())
                .filter(user -> user.getPassword().equals(request.getPassword()))
                .map(user -> {
                    session.setAttribute("user", user); // ✅ 세션 저장
                    return ResponseEntity.ok("로그인 성공");
                })
                .orElse(ResponseEntity.status(401).body("이메일 또는 비밀번호가 올바르지 않습니다."));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate(); // ✅ 세션 초기화
        return ResponseEntity.ok("로그아웃 성공");
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(HttpSession session) {
        Object user = session.getAttribute("user");
        System.out.println("🔍 세션 user 확인: " + user);
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(401).body("로그인 상태가 아닙니다.");
        }
    }

}