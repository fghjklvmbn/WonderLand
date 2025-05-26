package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.dto.NicknameRequest;
import com.example.demo.dto.PasswordChangeRequest;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/mypage")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class MypageController {

    private final UserRepository userRepository;

    // 회원 정보 조회 (POST /mypage/myinfo)
    @PostMapping("/myinfo")
    public ResponseEntity<?> getMyInfo(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(401).body("로그인 필요");
        }
    }

    // 회원 정보 수정 (PUT /mypage/myinfoupdate)
    @PutMapping("/myinfoupdate")
    public ResponseEntity<?> updateInfo(@RequestBody PasswordChangeRequest request, HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) return ResponseEntity.status(401).body("로그인 필요");

        if (!user.getPassword().equals(request.getCurrentPassword())) {
            return ResponseEntity.status(400).body("현재 비밀번호 불일치");
        }

        user.setPassword(request.getNewPassword());
        userRepository.save(user);
        session.setAttribute("user", user);

        return ResponseEntity.ok("비밀번호 변경 성공");
    }

    // 닉네임만 별도로 수정
    @PutMapping("/nickname")
    public ResponseEntity<?> updateNickname(@RequestBody NicknameRequest request, HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) return ResponseEntity.status(401).body("로그인 필요");

        user.setNickname(request.getNickname());
        userRepository.save(user);
        session.setAttribute("user", user);

        return ResponseEntity.ok("닉네임 변경 완료");
    }

    // 회원 탈퇴
    @DeleteMapping("/unregister")
    public ResponseEntity<?> deleteAccount(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) return ResponseEntity.status(401).body("로그인 필요");

        userRepository.deleteById(user.getUserId());
        session.invalidate(); // 세션 만료
        return ResponseEntity.ok("회원 탈퇴 성공");
    }


}
