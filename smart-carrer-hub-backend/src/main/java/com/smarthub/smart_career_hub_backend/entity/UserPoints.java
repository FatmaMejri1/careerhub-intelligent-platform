package com.smarthub.smart_career_hub_backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_points")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserPoints {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "utilisateur_id", unique = true)
    private Utilisateur utilisateur;

    private int totalPoints = 0;
    
    private int experienceLevel = 1; // Number 1, 2, 3...
    
    private String levelName = "Beginner"; // Beginner, Explorer, Professional, Expert, Elite
}
