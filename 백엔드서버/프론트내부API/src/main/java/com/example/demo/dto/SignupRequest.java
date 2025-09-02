package com.example.demo.dto;

import lombok.Data;

@Data
public class SignupRequest {
    private String email;
    private String password;
    private String name;
    private String nickname;
    private Integer age;
    private String phoneNumber;
}
