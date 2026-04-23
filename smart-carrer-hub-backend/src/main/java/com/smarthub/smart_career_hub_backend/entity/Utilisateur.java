package com.smarthub.smart_career_hub_backend.entity;

import jakarta.persistence.*;
import com.smarthub.smart_career_hub_backend.enums.Role;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;
import java.time.LocalDateTime;
import lombok.ToString;
import lombok.EqualsAndHashCode;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = { "notifications", "badges" })
@EqualsAndHashCode(exclude = { "notifications", "badges" })
@Entity
@Table(name = "utilisateurs")
@Inheritance(strategy = InheritanceType.JOINED)
@JsonIgnoreProperties(ignoreUnknown = true)
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private String motDePasse;
    @Column(columnDefinition = "TEXT")
    private String photoUrl;

    @Enumerated(EnumType.STRING)
    private Role role;

    private String statut = "Actif"; // Actif, Suspendu, En attente

    private LocalDateTime dateCreation = LocalDateTime.now();

    // Notifications received by this user
    @OneToMany(mappedBy = "destinataire")
    @JsonIgnore
    private List<Notification> notifications;

    @ManyToMany
    @JoinTable(
        name = "user_badges",
        joinColumns = @JoinColumn(name = "utilisateur_id"),
        inverseJoinColumns = @JoinColumn(name = "badge_id")
    )
    @JsonIgnore
    private List<Badge> badges;

    @OneToOne(mappedBy = "utilisateur", cascade = CascadeType.ALL)
    @JsonIgnore
    private UserPoints userPoints;
}

