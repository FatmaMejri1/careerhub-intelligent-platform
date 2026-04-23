package com.smarthub.smart_career_hub_backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString(callSuper = true, exclude = { "quizList", "formations" })
@EqualsAndHashCode(callSuper = true, exclude = { "quizList", "formations" })
@Entity
@Table(name = "chercheurs")
public class ChercheurEmploi extends Utilisateur {

    @Column(columnDefinition = "TEXT")
    private String objectif; // Used as Bio

    private String niveauExperience; // Experience level (junior, mid, senior)

    @Column(length = 500)
    private String adresse;

    @Column(length = 500)
    private String titre; // Professional title

    // JSON Arrays stored as Strings (TEXT/TEXT)
    @Column(columnDefinition = "TEXT")
    private String competences;

    @Column(columnDefinition = "TEXT")
    private String experiences;

    @Column(columnDefinition = "TEXT")
    private String educations;

    @Column(columnDefinition = "TEXT")
    private String projects;

    @Column(columnDefinition = "TEXT")
    private String certifications;

    @Column(columnDefinition = "TEXT")
    private String cvUrl;

    // Social Links
    private String linkedin;
    private String github;
    private String portfolio;

    // Scores
    private Double employabilityScore = 0.0;
    private Double fraudScore = 0.0;

    @OneToMany(mappedBy = "chercheurEmploi")
    @JsonIgnore
    private List<Quiz> quizList;

    @ManyToMany(mappedBy = "participants")
    @JsonIgnore
    private List<Formation> formations;

}


