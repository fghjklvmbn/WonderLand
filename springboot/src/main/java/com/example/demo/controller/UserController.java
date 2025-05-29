package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.dto.NicknameRequest;
import com.example.demo.dto.PasswordChangeRequest;


import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import jakarta.servlet.http.HttpSession;

// import com.example.demo.config.JwtUtil;
import com.example.demo.dto.LoginRequest;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true") // ✅ 세션 연동
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body("이미 등록된 이메일입니다.");
        }
        userRepository.save(user);
        return ResponseEntity.ok("회원가입 성공");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpSession session) {
        return userRepository.findByEmail(request.getEmail())
                .filter(user -> user.getPassword().equals(request.getPassword()))
                .map(user -> {
                    session.setAttribute("user", user);
                    System.out.println("✅ 세션에 저장된 유저: " + user);
                    return ResponseEntity.ok("로그인 성공");
                })
                .orElse(ResponseEntity.status(401).body("이메일 또는 비밀번호가 올바르지 않습니다."));
    }

    // @PostMapping("/login")
    // public ResponseEntity<?> login(@RequestBody LoginRequest request) {
    //     return userRepository.findByEmail(request.getUserId())
    //             .filter(user -> user.getPassword().equals(request.getUserPassword()))
    //             .map(user -> {
    //                 // JWT 토큰 생성
    //                 String accessToken = JwtUtil.generateAccessToken(user);
    //                 String refreshToken = JwtUtil.generateRefreshToken(user);

    //                 // refreshToken은 저장소(예: Redis, DB)에 저장 필요 (생략 가능)
    //                 refreshTokenStore.save(user.getEmail(), refreshToken);

    //                 // 성공 응답 JSON 반환
    //                 Map<String, Object> response = new HashMap<>();
    //                 response.put("status", "로그인이 성공하였습니다.");
    //                 response.put("access_token", accessToken);
    //                 response.put("refresh_token", refreshToken);

    //                 return ResponseEntity.ok(response);
    //             })
    //             .orElseGet(() -> {
    //                 // 실패 응답 JSON 반환
    //                 Map<String, Object> error = new HashMap<>();
    //                 error.put("status", "로그인이 실패하였습니다.");
    //                 error.put("err_code", "AUTH_FAILED");
    //                 error.put("err_message", "이메일 또는 비밀번호가 올바르지 않습니다.");
    //                 return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    //             });
    // }


    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate(); // ✅ 세션 제거
        return ResponseEntity.ok("로그아웃 성공");
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(HttpSession session) {
        Object user = session.getAttribute("user");
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(401).body("로그인 상태가 아닙니다.");
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String newPassword = request.get("newPassword");

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("등록되지 않은 이메일입니다.");
        }

        user.setPassword(newPassword);
        userRepository.save(user);
        return ResponseEntity.ok("비밀번호가 변경되었습니다.");
    }

    // 이메일 찾기
    @PostMapping("/find-email")
    public ResponseEntity<String> findEmail(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        String password = request.get("password");

        User user = userRepository.findByNameAndPassword(name, password).orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("일치하는 사용자를 찾을 수 없습니다.");
        }

        return ResponseEntity.ok(user.getEmail());
    }


}
