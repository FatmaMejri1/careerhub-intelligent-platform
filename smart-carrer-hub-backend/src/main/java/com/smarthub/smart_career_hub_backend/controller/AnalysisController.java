package com.smarthub.smart_career_hub_backend.controller;

import com.smarthub.smart_career_hub_backend.dto.ai.CVAnalysisRequestDTO;
import com.smarthub.smart_career_hub_backend.dto.ai.CVAnalysisResponseDTO;
import com.smarthub.smart_career_hub_backend.dto.ai.CVGenerationRequestDTO;
import com.smarthub.smart_career_hub_backend.service.AIService;
import com.smarthub.smart_career_hub_backend.service.DocumentParserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

@RestController
@RequestMapping("/api/analysis")
public class AnalysisController {

    private final AIService aiService;
    private final DocumentParserService documentParserService;

    public AnalysisController(AIService aiService, DocumentParserService documentParserService) {
        this.aiService = aiService;
        this.documentParserService = documentParserService;
    }

    @PostMapping("/cv")
    public ResponseEntity<CVAnalysisResponseDTO> analyzeCV(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "jobDescription", required = false) String jobDescription
    ) {
        System.out.println("Received CV analysis request. File size: " + file.getSize() + ", Name: " + file.getOriginalFilename());
        try {
            String cvText = documentParserService.extractText(file);
            CVAnalysisRequestDTO request = CVAnalysisRequestDTO.builder()
                    .cvText(cvText)
                    .jobDescription(jobDescription)
                    .build();

            CVAnalysisResponseDTO response = aiService.analyzeCV(request);
            if (response != null) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.internalServerError().build();
            }
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            System.err.println("Fatal error in analyzeCV: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/generate")
    public ResponseEntity<java.util.Map<String, Object>> generateDocument(@RequestBody CVGenerationRequestDTO request) {
        try {
            java.util.Map<String, Object> result = aiService.generateDocument(request);
            if (result != null) {
                return ResponseEntity.ok(result);
            } else {
                return ResponseEntity.internalServerError().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
    @PostMapping("/recommend-profile")
    public ResponseEntity<java.util.Map<String, Object>> recommendProfile(@RequestBody java.util.Map<String, Object> profileData) {
        try {
            java.util.Map<String, Object> result = aiService.recommendForProfile(profileData);
            if (result != null) {
                return ResponseEntity.ok(result);
            } else {
                return ResponseEntity.internalServerError().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
