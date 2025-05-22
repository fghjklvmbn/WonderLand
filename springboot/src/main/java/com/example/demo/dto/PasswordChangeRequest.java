package com.example.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PasswordChangeRequest {
    private String current;
    private String newPassword;
}
