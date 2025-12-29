package com.smarthub.smart_career_hub_backend.entity;

import jakarta.persistence.*;
import com.smarthub.smart_career_hub_backend.enums.TypeNotification;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String message;

    @Enumerated(EnumType.STRING)
    private TypeNotification type;

    // Notification belongs to one admin
    @ManyToOne
    @JoinColumn(name = "administrateur_id")
    private Administrateur administrateur;

    // Optional: if you want to notify other users later
    @ManyToOne
    @JoinColumn(name = "destinataire_id")
    private Utilisateur destinataire;
}
