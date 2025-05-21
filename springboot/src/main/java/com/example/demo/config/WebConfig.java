package com.example.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")                   // ① "/api/**" 경로에 대해
                .allowedOrigins("http://localhost:3000") // ② React 앱 주소에서 오는 요청 허용
                .allowedMethods("*")                     // ③ GET, POST, PUT 등 모든 HTTP 메서드 허용
                .allowCredentials(true);                 // ④ 세션 쿠키 같은 credential 허용
    }
}
