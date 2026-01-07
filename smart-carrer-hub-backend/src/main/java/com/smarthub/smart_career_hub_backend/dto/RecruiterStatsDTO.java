package com.smarthub.smart_career_hub_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecruiterStatsDTO {
    private long totalOffers;
    private long totalApplications;
    private double averageTimeToHire; // in days
    private double conversionRate; // percentage

    private Map<String, Long> statusDistribution;
    private List<OfferStatsDTO> topOffers;
    private List<Map<String, Object>> recentApplications;

    // Performance vs last month (placeholders for now)
    private double offersGrowth;
    private double appsGrowth;
    private double averageMatchScore;
    private long fraudulentAlertsCount;
}
