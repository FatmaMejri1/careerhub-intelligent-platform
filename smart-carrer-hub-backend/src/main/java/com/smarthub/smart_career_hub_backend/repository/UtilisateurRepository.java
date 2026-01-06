package com.smarthub.smart_career_hub_backend.repository;

import com.smarthub.smart_career_hub_backend.entity.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {
    Optional<Utilisateur> findByEmail(String email);

    java.util.List<Utilisateur> findTop5ByOrderByIdDesc();
}
