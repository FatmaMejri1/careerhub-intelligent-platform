package com.smarthub.smart_career_hub_backend.service;

import com.smarthub.smart_career_hub_backend.dto.ai.AIQuizRequestDTO;
import com.smarthub.smart_career_hub_backend.dto.ai.AIQuizResponseDTO;
import com.smarthub.smart_career_hub_backend.dto.ai.CVAnalysisRequestDTO;
import com.smarthub.smart_career_hub_backend.dto.ai.CVAnalysisResponseDTO;
import com.smarthub.smart_career_hub_backend.dto.ai.CVGenerationRequestDTO;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import io.netty.handler.timeout.ReadTimeoutHandler;
import io.netty.handler.timeout.WriteTimeoutHandler;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import reactor.netty.http.client.HttpClient;

import java.time.Duration;
import java.util.concurrent.TimeUnit;

@Service
public class AIService {

    private final WebClient webClient;

    public AIService(WebClient.Builder webClientBuilder) {
        HttpClient httpClient = HttpClient.create()
                .option(io.netty.channel.ChannelOption.CONNECT_TIMEOUT_MILLIS, 10000)
                .responseTimeout(Duration.ofSeconds(300))
                .doOnConnected(conn -> conn.addHandlerLast(new ReadTimeoutHandler(300, TimeUnit.SECONDS))
                        .addHandlerLast(new WriteTimeoutHandler(300, TimeUnit.SECONDS)));

        this.webClient = webClientBuilder
                .baseUrl("http://127.0.0.1:8000")
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .build();
    }

    public AIQuizResponseDTO generateQuiz(AIQuizRequestDTO request) {
        try {
            return this.webClient.post()
                    .uri("/api/quiz/generate")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(AIQuizResponseDTO.class)
                    .block();
        } catch (Exception e) {
            System.err.println("Error in AIService communicating with Python Microservice: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    public CVAnalysisResponseDTO analyzeCV(CVAnalysisRequestDTO request) {
        try {
            System.out.println("Sending CV text to AI (len=" + (request.getCvText() != null ? request.getCvText().length() : 0) + ")");
            return this.webClient.post()
                    .uri("/api/analysis/cv")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(CVAnalysisResponseDTO.class)
                    .block();
        } catch (Exception e) {
            System.err.println("Error in AIService analyzing CV: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    public java.util.Map<String, Object> generateDocument(CVGenerationRequestDTO request) {
        try {
            return this.webClient.post()
                    .uri("/api/analysis/generate")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(new org.springframework.core.ParameterizedTypeReference<java.util.Map<String, Object>>() {})
                    .block();
        } catch (Exception e) {
            System.err.println("Error in AIService generating document: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    public java.util.Map<String, Object> recommendForProfile(java.util.Map<String, Object> profileData) {
        try {
            return this.webClient.post()
                    .uri("/api/analysis/recommend-profile")
                    .bodyValue(profileData)
                    .retrieve()
                    .bodyToMono(new org.springframework.core.ParameterizedTypeReference<java.util.Map<String, Object>>() {})
                    .block();
        } catch (Exception e) {
            System.err.println("Error in AIService recommending for profile: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }
}
