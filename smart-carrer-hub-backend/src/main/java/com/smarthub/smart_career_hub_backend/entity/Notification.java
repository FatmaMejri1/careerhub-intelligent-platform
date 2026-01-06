package com.smarthub.smart_career_hub_backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import com.smarthub.smart_career_hub_backend.enums.TypeNotification;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private TypeNotification type;

    private boolean isRead = false;
    private java.time.LocalDateTime dateCreation = java.time.LocalDateTime.now();

    // Notification belongs to one admin
    @ManyToOne
    @JoinColumn(name = "administrateur_id")
    @JsonIgnore
    @ToString.Exclude
    private Administrateur administrateur;

    // Optional: if you want to notify other users later
    @ManyToOne
    @JoinColumn(name = "destinataire_id")
    @JsonIgnore
    @ToString.Exclude
    private Utilisateur destinataire;
}
