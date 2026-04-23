package com.smarthub.smart_career_hub_backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class OffreDTO {
    private Long id;
    private String titre;
    private String description;
    private String type;
    private String location;
    private String statut;
    private LocalDateTime dateCreation;
    private Long recruteurId;
    private String nomEntreprise;
}
