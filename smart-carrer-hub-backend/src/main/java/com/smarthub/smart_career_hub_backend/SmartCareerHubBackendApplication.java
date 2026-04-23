package com.smarthub.smart_career_hub_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SmartCareerHubBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartCareerHubBackendApplication.class, args);
    }
}
