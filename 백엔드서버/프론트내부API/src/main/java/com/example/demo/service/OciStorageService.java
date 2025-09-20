package com.example.demo.service;

import com.oracle.bmc.objectstorage.ObjectStorage;
import com.oracle.bmc.objectstorage.requests.PutObjectRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.InputStream;

@Service
@RequiredArgsConstructor
public class OciStorageService {

    private final ObjectStorage objectStorage;
    private final String namespace = "dsapoi881"; // properties에서 주입 가능
    private final String bucketName = "bucket-wonderland_story-images";

    public String upload(String objectName, InputStream fileStream, long contentLength) {
        PutObjectRequest request = PutObjectRequest.builder()
                .namespaceName(namespace)
                .bucketName(bucketName)
                .objectName(objectName)
                .putObjectBody(fileStream)
                .contentLength(contentLength)
                .build();

        objectStorage.putObject(request);

        // OCI 기본 URL 형태 (퍼블릭 버킷일 경우)
        return String.format("https://objectstorage.ap-chuncheon-1.oraclecloud.com/p/QZ-hJCS7jUzR2zDn1vNOgBadp5g6uOrHrMJFYm8dsMh4BdHaspXdMccqJW2UERJ9/n/axfqsalsjypc/b/bucket-wonderland_story-images/o/",
                namespace, bucketName, objectName);
    }
}
