package com.example.demo.dto;

import lombok.Data;

@Data
public class StorySaveRequest {
    private String title;
    private StoryTextJson textJson;
}