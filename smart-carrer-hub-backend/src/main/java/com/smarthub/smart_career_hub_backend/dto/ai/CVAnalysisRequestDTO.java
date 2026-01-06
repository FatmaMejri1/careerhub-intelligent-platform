package com.smarthub.smart_career_hub_backend.dto.ai;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CVAnalysisRequestDTO {
    @JsonProperty("cv_text")
    private String cvText;
    @JsonProperty("job_description")
    private String jobDescription;
}
