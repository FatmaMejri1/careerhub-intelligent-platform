package com.smarthub.smart_career_hub_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserAdminDTO {
    private Long id;
    private String name;
    private String email;
    private String role;
    private String status; // Actif, Suspendu, En attente
    private Double reliabilityScore; // Based on fraudScore for candidates
    private LocalDateTime lastActivity;
    private LocalDateTime joinDate;
    private Long activityCount; // Applications for candidates, Offers for recruiters
    private String photoUrl;
}
