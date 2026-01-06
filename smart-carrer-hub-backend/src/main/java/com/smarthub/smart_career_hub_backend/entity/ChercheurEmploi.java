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
@ToString(callSuper = true, exclude = { "quizList", "coachings" })
@EqualsAndHashCode(callSuper = true, exclude = { "quizList", "coachings" })
@Entity
@Table(name = "chercheurs")
public class ChercheurEmploi extends Utilisateur {

    @Lob
    @Column(columnDefinition = "TEXT")
    private String objectif; // Used as Bio

    private String niveauExperience; // Experience level (junior, mid, senior)

    @Column(length = 500)
    private String adresse;

    @Column(length = 500)
    private String titre; // Professional title

    // JSON Arrays stored as Strings (TEXT/LONGTEXT)
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String competences;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String experiences;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String educations;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String projects;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String certifications;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
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

    @OneToMany(mappedBy = "chercheurEmploi")
    @JsonIgnore
    private List<Coaching> coachings;
}
