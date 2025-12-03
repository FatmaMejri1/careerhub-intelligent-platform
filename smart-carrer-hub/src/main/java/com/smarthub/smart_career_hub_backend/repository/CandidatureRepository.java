package com.smarthub.smart_career_hub_backend.repository;

import com.smarthub.smart_career_hub_backend.entity.Candidature;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CandidatureRepository extends JpaRepository<Candidature, Long> {


    List<Candidature> findByChercheurEmploiId(Long chercheurId); // récupère toutes les candidatures d'un chercheur
    List<Candidature> findByOffreId(Long offreId);               // récupère toutes les candidatures pour une offre donnée
}
