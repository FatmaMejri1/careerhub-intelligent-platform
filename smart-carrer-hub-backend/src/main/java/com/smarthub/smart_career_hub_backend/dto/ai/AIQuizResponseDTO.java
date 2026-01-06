package com.smarthub.smart_career_hub_backend.dto.ai;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@com.fasterxml.jackson.annotation.JsonIgnoreProperties(ignoreUnknown = true)
public class AIQuizResponseDTO {
    @JsonProperty("quiz_id")
    private String quizId;

    private List<AIQuestionDTO> questions;

    @JsonProperty("time_limit")
    private int timeLimit;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties(ignoreUnknown = true)
    public static class AIQuestionDTO {
        private String id;
        private String type;
        private String skill;
        private String text;
        private List<String> options;

        @JsonProperty("correct_answer")
        private int correctAnswer;

        private String explanation;
        private String difficulty;
    }
}
