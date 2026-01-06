package com.smarthub.smart_career_hub_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CandidateStatsDTO {
    private long totalApplications;
    private double profileCompletion;
    private Double employabilityScore;
    private Double fraudScore;
    private Double bestQuizScore;
    private Map<String, Long> applicationStatusDistribution; // PENDING, IN_REVIEW, ACCEPTED, REJECTED
    private List<Map<String, Object>> recentApplications;
    private List<Map<String, Object>> recommendedJobs;
}
