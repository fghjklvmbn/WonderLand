package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.oracle.bmc.auth.ConfigFileAuthenticationDetailsProvider;
import com.oracle.bmc.objectstorage.ObjectStorageClient;

@Configuration
public class OciConfig {

    @Bean
    public ObjectStorageClient objectStorageClient() throws Exception {
        String configPath = System.getProperty("user.dir") + "/.oci/config";
        return new ObjectStorageClient(
                new ConfigFileAuthenticationDetailsProvider(configPath, "DEFAULT")
        );
    }
}
