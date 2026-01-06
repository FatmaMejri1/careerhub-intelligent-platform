package com.smarthub.smart_career_hub_backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString(callSuper = true, exclude = { "offres" })
@EqualsAndHashCode(callSuper = true, exclude = { "offres" })
@Entity
@Table(name = "recruteurs")
public class Recruteur extends Utilisateur {

    // Informations professionnelles
    private String nomEntreprise;
    private String siteWeb;
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String descriptionEntreprise;
    private String adresseEntreprise;
    private String poste; // ex: Talent Acquisition Manager

    // Réseaux sociaux
    private String linkedin;
    private String twitter;

    // Image de profil (stockage base64 ou URL)
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String profileImage;

    // Spécialités de recrutement
    @ElementCollection
    @CollectionTable(name = "recruteur_specialities", joinColumns = @JoinColumn(name = "recruteur_id"))
    @Column(name = "speciality")
    private List<String> specialities;

    // Offres publiées par le recruteur
    @OneToMany(mappedBy = "recruteur", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Offre> offres;
}
