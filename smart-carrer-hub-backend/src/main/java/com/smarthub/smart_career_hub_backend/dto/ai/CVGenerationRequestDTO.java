package com.smarthub.smart_career_hub_backend.dto.ai;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CVGenerationRequestDTO {
    @JsonProperty("target_job")
    @JsonAlias("targetJob")
    private String targetJob;
    @JsonProperty("additional_info")
    @JsonAlias("additionalInfo")
    private String additionalInfo;
    private String type; // 'cv' or 'lm'
    @JsonProperty("profile_data")
    @JsonAlias("profileData")
    private java.util.Map<String, Object> profileData;
}
