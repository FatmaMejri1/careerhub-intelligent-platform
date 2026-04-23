package com.smarthub.smart_career_hub_backend.repository;

import com.smarthub.smart_career_hub_backend.entity.UserPoints;
import com.smarthub.smart_career_hub_backend.entity.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserPointsRepository extends JpaRepository<UserPoints, Long> {
    Optional<UserPoints> findByUtilisateur(Utilisateur utilisateur);
    Optional<UserPoints> findByUtilisateurId(Long userId);
}
