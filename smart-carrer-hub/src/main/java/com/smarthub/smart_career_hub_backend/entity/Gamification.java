package com.smarthub.smart_career_hub_backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "gamifications")
public class Gamification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type;          // Exemple : Badge, Points, Niveau
    private Integer points;       // Points gagnés par le chercheur
    private String description;
    private LocalDate dateObtention;

    @ManyToOne
    @JoinColumn(name = "chercheur_id")
    private ChercheurEmploi chercheurEmploi;
}
