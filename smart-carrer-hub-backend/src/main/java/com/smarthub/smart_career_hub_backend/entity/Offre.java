package com.smarthub.smart_career_hub_backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.util.List;
import com.smarthub.smart_career_hub_backend.enums.StatutOffre;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "offres")
@JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
public class Offre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titre;
    private String description;

    @Enumerated(EnumType.STRING)
    private StatutOffre statut;
//Many offers (`Offre`) can belong to **one recruiter** (`Recruteur`).
    @ManyToOne
    @JoinColumn(name = "recruteur_id")
    @JsonIgnoreProperties({"offres"})
    private Recruteur recruteur;
//One offer can have multiple applications (candidatures).
    @OneToMany(mappedBy = "offre")
    @JsonIgnore
    private List<Candidature> candidatures;
}
