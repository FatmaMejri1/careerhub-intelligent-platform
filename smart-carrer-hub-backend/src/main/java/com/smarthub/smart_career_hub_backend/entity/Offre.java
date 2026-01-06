package com.smarthub.smart_career_hub_backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.util.List;
import com.smarthub.smart_career_hub_backend.enums.StatutOffre;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.ToString;
import lombok.EqualsAndHashCode;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = { "recruteur", "candidatures" })
@EqualsAndHashCode(exclude = { "recruteur", "candidatures" })
@Entity
@Table(name = "offres")
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Offre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titre;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String description;

    @Transient
    @com.fasterxml.jackson.annotation.JsonProperty("recruteurId")
    private Long recruteurIdTransient;

    @Column(length = 50)
    private String type; // CDI, CDD, Stage, Freelance

    @Column(length = 100)
    private String location; // Tunis, Remote, etc.

    @Column(name = "date_creation")
    private java.time.LocalDateTime dateCreation;

    @Enumerated(EnumType.STRING)
    private StatutOffre statut;
    // Many offers (`Offre`) can belong to **one recruiter** (`Recruteur`).
    @ManyToOne
    @JoinColumn(name = "recruteur_id")
    @JsonIgnoreProperties({ "offres" })
    private Recruteur recruteur;
    // One offer can have multiple applications (candidatures).
    @OneToMany(mappedBy = "offre", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Candidature> candidatures;
}
