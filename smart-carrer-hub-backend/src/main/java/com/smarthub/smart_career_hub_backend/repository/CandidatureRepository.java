package com.smarthub.smart_career_hub_backend.repository;

import com.smarthub.smart_career_hub_backend.entity.Candidature;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CandidatureRepository extends JpaRepository<Candidature, Long> {

    List<Candidature> findByChercheurEmploiId(Long chercheurId);

    List<Candidature> findByOffreId(Long offreId);

    List<Candidature> findByOffre_Recruteur_Id(Long recruiterId);
}
