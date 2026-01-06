package com.smarthub.smart_career_hub_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizDTO {
    private String title;
    private List<QuestionDTO> questions;
    private int timeLimit; // in seconds

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuestionDTO {
        private String question;
        private List<String> options;
        private int correctOptionIndex;
        private String explanation;
        private String skillArea;
        private String difficulty;
    }
}
