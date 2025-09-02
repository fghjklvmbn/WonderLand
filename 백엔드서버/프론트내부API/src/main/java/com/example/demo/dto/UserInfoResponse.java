package com.example.demo.dto;

import com.example.demo.model.User;
import lombok.Getter;

@Getter
public class UserInfoResponse {
    private final String email;
    private final String nickname;
    private final String name;

    public UserInfoResponse(User user) {
        this.email = user.getEmail();
        this.nickname = user.getNickname();
        this.name = user.getName();
    }
}
