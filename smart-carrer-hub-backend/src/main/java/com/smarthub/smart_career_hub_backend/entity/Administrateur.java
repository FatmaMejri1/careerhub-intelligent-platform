package com.smarthub.smart_career_hub_backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "administrateurs")
public class Administrateur extends Utilisateur {

    /*
     * =========================
     * Informations personnelles
     * =========================
     */

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "phone", length = 20)
    private String phone;

    /**
     * Stocke l’URL ou le chemin de l’image de profil ou base64
     * ex: /uploads/admins/admin_1.jpg
     */
    @Column(name = "profile_image", columnDefinition = "TEXT")
    private String profileImage;

    /*
     * =========================
     * Sécurité & activité
     * =========================
     */

    @Column(name = "last_login")
    private LocalDateTime lastLogin;

    /*
     * =========================
     * Relations
     * =========================
     */

    @OneToMany(mappedBy = "administrateur", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @ToString.Exclude
    private List<Notification> managedNotifications;
}


