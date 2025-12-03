package com.smarthub.smart_career_hub_backend.repository;

import com.smarthub.smart_career_hub_backend.entity.Formation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FormationRepository extends JpaRepository<Formation, Long> {
    // Tu peux ajouter des méthodes spécifiques si nécessaire, par exemple :
    // List<Formation> findByTitreContaining(String titre);
}
