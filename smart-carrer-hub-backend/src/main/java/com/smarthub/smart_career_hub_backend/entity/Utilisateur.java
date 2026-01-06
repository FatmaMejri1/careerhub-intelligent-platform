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
@ToString(exclude = "notifications")
@EqualsAndHashCode(exclude = "notifications")
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
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String photoUrl;

    @Enumerated(EnumType.STRING)
    private Role role;

    private String statut = "Actif"; // Actif, Suspendu, En attente

    private LocalDateTime dateCreation = LocalDateTime.now();

    // Notifications received by this user
    @OneToMany(mappedBy = "destinataire")
    @JsonIgnore
    private List<Notification> notifications;
}
