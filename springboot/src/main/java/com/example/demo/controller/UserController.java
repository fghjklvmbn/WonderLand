package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.dto.NicknameRequest;
import com.example.demo.dto.PasswordChangeRequest;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true") // ✅ 세션 연동
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

    // @PostMapping("/login")
    // public ResponseEntity<String> login(@RequestBody User loginUser, HttpSession session) {
    //     User user = userRepository.findByEmail(loginUser.getEmail()).orElse(null);
    //     if (user == null || !user.getPassword().equals(loginUser.getPassword())) {
    //         return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    //     }

    //     session.setAttribute("user", user); // ✅ 세션 저장
    //     return ResponseEntity.ok("로그인 성공");
    // }

    // @PostMapping("/logout")
    // public ResponseEntity<?> logout(HttpSession session) {
    //     session.invalidate(); // ✅ 세션 제거
    //     return ResponseEntity.ok("로그아웃 성공");
    // }

    // 비밀번호 초기화
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

    // ✅ 닉네임 변경 API
    @PutMapping("/update-nickname")
    public ResponseEntity<?> updateNickname(@RequestBody NicknameRequest request, HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        user.setNickname(request.getNickname());
        userRepository.save(user);
        session.setAttribute("user", user); // 세션도 최신화

        return ResponseEntity.ok("닉네임이 변경되었습니다.");
    }

    // ✅ 비밀번호 변경 API
    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody PasswordChangeRequest request, HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) return ResponseEntity.status(401).body("로그인 필요");

        if (!user.getPassword().equals(request.getCurrent())) {
            return ResponseEntity.status(400).body("현재 비밀번호 불일치");
        }

        user.setPassword(request.getNewPassword());
        userRepository.save(user);

        return ResponseEntity.ok("비밀번호 변경 성공");
    }

}
