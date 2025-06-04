package com.example.demo.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.core.io.Resource;
import org.springframework.core.io.FileSystemResource;

import java.nio.file.*;
import java.io.File;
import java.io.IOException;
import java.util.Optional;
import java.util.stream.Stream;

@RestController
@RequestMapping("/api/audio")
public class AudioController {

    // 음성 파일들이 저장된 디렉토리 경로
    private final String audioFolderPath = "D:/test_dataset/database_wav/";

    // 음성 파일을 URL로 제공하는 API
    @GetMapping("/files/{filename:.+}")
    public ResponseEntity<Resource> getAudioFile(@PathVariable String filename) throws IOException {
        System.out.println("파일 이름: " + filename); // 디버깅: 요청된 파일 이름 출력

        Optional<Path> filePath = findFile(audioFolderPath, filename);

        if (filePath.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        Resource resource = new FileSystemResource(filePath.get().toFile());

        // 파일이 존재하면 ResponseEntity로 반환 
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .body(resource);
    }

    // 파일을 재귀적으로 검색하는 메서드
    private Optional<Path> findFile(String directory, String filename) throws IOException {
        System.out.println("검색 디렉토리: " + directory); 
        try (Stream<Path> paths = Files.walk(Paths.get(directory))) {
            return paths
                    .filter(path -> path.getFileName().toString().equals(filename)) // 파일 이름비교
                    .findFirst();  // 첫 번째로 찾은 파일 반환
        }
    }
}
