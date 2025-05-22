package com.example.demo.dto;

import lombok.Data;
import java.util.List;

@Data
public class StoryTextJson {
    private List<String> genre;
    private List<String> pages;
}
