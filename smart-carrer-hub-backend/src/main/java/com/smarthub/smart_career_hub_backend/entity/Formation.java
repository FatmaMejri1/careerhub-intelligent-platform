package com.smarthub.smart_career_hub_backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "formations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Formation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titre;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private String plateforme;
    
    private String url;
    
    private String duree;
    
    private String niveau;
    
    private String competenceAssociee;

    @ManyToMany
    @JoinTable(
        name = "formation_participants",
        joinColumns = @JoinColumn(name = "formation_id"),
        inverseJoinColumns = @JoinColumn(name = "chercheur_id")
    )
    @JsonIgnoreProperties("formations")
    private List<ChercheurEmploi> participants = new ArrayList<>();
}
