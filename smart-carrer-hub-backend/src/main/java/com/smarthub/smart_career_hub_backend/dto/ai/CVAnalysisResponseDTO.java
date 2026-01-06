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
public class CVAnalysisResponseDTO {
    @JsonProperty("extracted_skills")
    private List<SkillAnalysisDTO> extractedSkills;
    @JsonProperty("experience_level")
    private String experienceLevel;
    @JsonProperty("years_experience")
    private Double yearsExperience;
    private String summary;
    
    @JsonProperty("clarity_score")
    private double clarityScore;
    @JsonProperty("linguistic_faults")
    private List<String> linguisticFaults;
    @JsonProperty("visibility_recommendations")
    private List<String> visibilityRecommendations;
    @JsonProperty("recommended_jobs")
    private List<String> recommendedJobs;
    @JsonProperty("recommended_certificates")
    private List<String> recommendedCertificates;
    @JsonProperty("tools_to_learn")
    private List<String> toolsToLearn;
    @JsonProperty("structural_feedback")
    private String structuralFeedback;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SkillAnalysisDTO {
        private String skill;
        private double confidence;
        private String level;
    }
}
