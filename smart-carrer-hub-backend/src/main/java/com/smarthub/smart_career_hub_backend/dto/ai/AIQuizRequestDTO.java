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
public class AIQuizRequestDTO {
    @JsonProperty("job_description")
    private String jobDescription;

    @JsonProperty("required_skills")
    private List<String> requiredSkills;

    @JsonProperty("candidate_level")
    private String candidateLevel; // "beginner", "intermediate", "advanced"

    @JsonProperty("num_questions")
    private int numQuestions;
}
