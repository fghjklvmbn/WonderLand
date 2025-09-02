// package com.example.demo.config;

// import io.jsonwebtoken.*;
// import io.jsonwebtoken.security.Keys;
// import org.springframework.stereotype.Component;

// import com.example.demo.model.User;

// import java.security.Key;
// import java.util.Date;

// @Component
// public class JwtUtil {

//     // 시크릿 키 (보안을 위해 환경변수나 properties로 빼는 것이 좋음)
//     private static final String SECRET_KEY = "your-super-secret-key-which-should-be-at-least-256-bits-long!";
//     private final static Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

//     // 토큰 유효 시간
//     private static final long ACCESS_TOKEN_EXPIRATION = 1000 * 60 * 30; // 30분
//     private static final long REFRESH_TOKEN_EXPIRATION = 1000L * 60 * 60 * 24 * 7; // 7일

//     // ✅ Access Token 생성
//     public static String generateAccessToken(User user) {
//         return Jwts.builder()
//                 .setSubject(user.getEmail())
//                 .claim("role", "USER")  // 필요한 정보 추가
//                 .setIssuedAt(new Date())
//                 .setExpiration(new Date(System.currentTimeMillis() + ACCESS_TOKEN_EXPIRATION))
//                 .signWith(key, SignatureAlgorithm.HS256)
//                 .compact();
//     }

//     // ✅ Refresh Token 생성
//     public static String generateRefreshToken(User user) {
//         return Jwts.builder()
//                 .setSubject(user.getEmail())
//                 .setIssuedAt(new Date())
//                 .setExpiration(new Date(System.currentTimeMillis() + REFRESH_TOKEN_EXPIRATION))
//                 .signWith(key, SignatureAlgorithm.HS256)
//                 .compact();
//     }

//     // ✅ 토큰에서 이메일 추출
//     public String extractEmail(String token) {
//         return getClaims(token).getSubject();
//     }

//     // ✅ 토큰 유효성 검사
//     public boolean isTokenValid(String token) {
//         try {
//             getClaims(token);
//             return true;
//         } catch (JwtException | IllegalArgumentException e) {
//             return false;
//         }
//     }

//     // ✅ Claims 파싱
//     private Claims getClaims(String token) {
//         return Jwts.parserBuilder()
//                 .setSigningKey(key)
//                 .build()
//                 .parseClaimsJws(token)
//                 .getBody();
//     }
// }
