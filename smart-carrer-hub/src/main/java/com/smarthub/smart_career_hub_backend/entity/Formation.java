package com.smarthub.smart_career_hub_backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.Collection;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "formations")// set the table name in db  Formations
public class Formation {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nom;
    private String description;
    // searchers can enroll in many trainings
    @ManyToMany
    @JoinTable(
        name = "formation_participants",
        joinColumns = @JoinColumn(name = "formation_id"),
        inverseJoinColumns = @JoinColumn(name = "chercheur_id")
    )
    @JsonIgnore
    // class will be created automatically by jpa , no need to create it in uml , it just to store relation between formation and searchers who join it
    private Collection<ChercheurEmploi> participants;
}
