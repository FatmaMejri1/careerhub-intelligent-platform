package com.smarthub.smart_career_hub_backend.repository;

import com.smarthub.smart_career_hub_backend.entity.Administrateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdministrateurRepository extends JpaRepository<Administrateur, Long> {

    /*
     * =========================
     * Méthodes personnalisées
     * (Spring Data JPA auto-génère les requêtes)
     * =========================
     */

    // Trouver un administrateur par email (login / profile)
    Optional<Administrateur> findByEmail(String email);

    // Vérifier si un email existe déjà (création / update)
    boolean existsByEmail(String email);

}
