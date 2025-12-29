package com.smarthub.smart_career_hub_backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import com.smarthub.smart_career_hub_backend.enums.StatutCandidature;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data// generates methods of java automatically  , e
@NoArgsConstructor
@AllArgsConstructor
@Entity // marks class as persistent jpa entity
@Table(name = "candidatures") //table name in db
public class Candidature {

    @Id //primary key in db
    @GeneratedValue(strategy = GenerationType.IDENTITY) //generate the id in db for each new entry
    private Long id;

    @ManyToOne //many candidature can belong to one searcher"submit multiple apps for different job offers."
    @JoinColumn(name = "chercheur_id")
    @JsonIgnoreProperties({"quizList","coachings"})
    private ChercheurEmploi chercheurEmploi;
     //can receive many applications from different candidates.
    @ManyToOne
    @JoinColumn(name = "offre_id")
    @JsonIgnoreProperties({"candidatures"})
    private Offre offre;
     //Maps a Java enum to a database column."is to store the status of the application"
    @Enumerated(EnumType.STRING)
    private StatutCandidature statut;
}
