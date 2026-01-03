package com.smarthub.smart_career_hub_backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "chercheurs")
public class ChercheurEmploi extends Utilisateur {

    private String objectif; // Used as Bio
    private String niveauExperience; // Experience level (junior, mid, senior)
    private String adresse;
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

    @OneToMany(mappedBy = "chercheurEmploi")
    @JsonIgnore
    private List<Quiz> quizList;

    @OneToMany(mappedBy = "chercheurEmploi")
    @JsonIgnore
    private List<Coaching> coachings;
}
