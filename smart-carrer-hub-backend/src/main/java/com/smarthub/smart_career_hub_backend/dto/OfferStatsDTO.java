package com.smarthub.smart_career_hub_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OfferStatsDTO {
    private Long id;
    private String title;
    private long views; // placeholder
    private long applications;
    private double conversionRate;
    private double averageQuality; // placeholder
    private int delayDays;
}
