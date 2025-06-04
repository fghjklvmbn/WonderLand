package com.example.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
public class frontendController {

    @GetMapping("/")
    public String ping() {
        return "응답";
    }

    @PostMapping("/DB/story")
    public String test1(@RequestBody String entity) {
        //TODO: process POST request
        entity = "테스트";
        return entity;
    }

    @PostMapping("/story/img/:id")
    public String test2(@RequestBody String entity) {
        //TODO: process POST request
        // 해당 이미지의 로드하는 코드 추가 필요
        // 리턴할때 어떻게 하는지도 구성 필요
        String a = "0";

        if (entity == "1") {
            a = "1";
        } else {
            a = "0";
        }

        return a;
    }
    
    
}
