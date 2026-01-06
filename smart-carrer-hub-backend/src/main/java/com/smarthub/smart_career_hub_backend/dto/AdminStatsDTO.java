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
public class AdminStatsDTO {
    private long totalUsers;
    private long totalCandidates;
    private long totalRecruiters;
    private long totalOffers;
    private long totalApplications;
    private long reportedFrauds;
    private List<Map<String, Object>> recentUsers;
    private List<Map<String, Object>> recentOffers;
    private List<Map<String, Object>> fraudAlerts;
}
