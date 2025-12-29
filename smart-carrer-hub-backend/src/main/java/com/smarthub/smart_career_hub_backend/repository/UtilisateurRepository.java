package com.smarthub.smart_career_hub_backend.repository;

import com.smarthub.smart_career_hub_backend.entity.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {
    Utilisateur findByEmail(String email);
    // On pourra ajouter des méthodes personnalisées plus tard
}
