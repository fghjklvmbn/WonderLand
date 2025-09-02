package com.example.demo;

public class StableDiffusionRequest {
    public String model = "stable-diffusion";
    public String prompt;
    public String negative_prompt = "";
    public int width = 512;
    public int height = 512;
    public int steps = 30;
}
