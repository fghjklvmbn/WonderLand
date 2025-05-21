// package com.example.demo.controller;

// import com.example.demo.model.User;
// import com.example.demo.repository.UserRepository;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.web.bind.annotation.*;

// @RestController
// @RequestMapping("/api/users")
// @CrossOrigin(origins = "http://localhost:3000") // React 포트 기준
// public class UserController {

//     @Autowired
//     private UserRepository userRepository;

//     @PostMapping("/signup")
//     public String signup(@RequestBody User user) {
//         if (userRepository.existsByEmail(user.getEmail())) {
//             return "이미 등록된 이메일입니다.";
//         }
//         userRepository.save(user);
//         return "회원가입 성공";
//     }

//     @PostMapping("/login")
//     public String login(@RequestBody User loginUser) {
//         User user = userRepository.findByEmail(loginUser.getEmail()).orElse(null);
//         if (user == null || !user.getPassword().equals(loginUser.getPassword())) {
//             return "이메일 또는 비밀번호가 일치하지 않습니다.";
//         }
//         return "로그인 성공";
//     }

//     @PostMapping("/logout")
//     public String logout() {
//         return "로그아웃 성공";
//     }
// }

// 우빈 추가 코드 테스트 해야함

package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;


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


// 로그인 처리 메서드 수정
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody User loginUser) {
        User user = userRepository.findByEmail(loginUser.getEmail()).orElse(null);
        if (user == null || !user.getPassword().equals(loginUser.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok("로그인 성공");
    }

    @PostMapping("/logout")
    public String logout() {
        return "로그아웃 성공";
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
