package com.smarthub.smart_career_hub_backend.entity;

import jakarta.persistence.*;
import com.smarthub.smart_career_hub_backend.enums.Role;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "utilisateurs")
@Inheritance(strategy = InheritanceType.JOINED)
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

    // Notifications received by this user
    @OneToMany(mappedBy = "destinataire")
    private List<Notification> notifications;
}
