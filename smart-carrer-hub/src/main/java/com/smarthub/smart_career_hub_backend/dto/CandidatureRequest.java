package com.smarthub.smart_career_hub_backend.dto;

import com.smarthub.smart_career_hub_backend.enums.StatutCandidature;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CandidatureRequest {
    private Long chercheurId;
    private Long offreId;
    private StatutCandidature statut;
}

