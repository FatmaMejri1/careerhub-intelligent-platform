package com.smarthub.smart_career_hub_backend.service;

import com.smarthub.smart_career_hub_backend.dto.CandidatureRequest;
import com.smarthub.smart_career_hub_backend.entity.Candidature;
import com.smarthub.smart_career_hub_backend.entity.ChercheurEmploi;
import com.smarthub.smart_career_hub_backend.entity.Offre;
import com.smarthub.smart_career_hub_backend.enums.StatutCandidature;
import com.smarthub.smart_career_hub_backend.repository.CandidatureRepository;
import com.smarthub.smart_career_hub_backend.repository.ChercheurEmploiRepository;
import com.smarthub.smart_career_hub_backend.repository.OffreRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CandidatureService {

    private final CandidatureRepository candidatureRepository;
    private final ChercheurEmploiRepository chercheurEmploiRepository;
    private final OffreRepository offreRepository;

    //constructor injection
    public CandidatureService(CandidatureRepository candidatureRepository,
                              ChercheurEmploiRepository chercheurEmploiRepository,
                              OffreRepository offreRepository) {
        this.candidatureRepository = candidatureRepository;
        this.chercheurEmploiRepository = chercheurEmploiRepository;
        this.offreRepository = offreRepository;
    }


    // Gestion Candidature (crud)

    // récupérer candiadture par id
    public List<Candidature> getAllCandidatures() {
        return candidatureRepository.findAll();
    }
    //return optional pour gérer le cas id n'existe pas
    public Optional<Candidature> getCandidatureById(Long id) {
        return candidatureRepository.findById(id);
    }

    //Ajouter une candidature
    public Candidature ajouterCandidature(Long chercheurId, Long offreId) {
        ChercheurEmploi chercheur = chercheurEmploiRepository.findById(chercheurId)
                .orElseThrow(() -> new RuntimeException("Chercheur non trouvé"));
        Offre offre = offreRepository.findById(offreId)
                .orElseThrow(() -> new RuntimeException("Offre non trouvée"));

        Candidature candidature = new Candidature();
        candidature.setChercheurEmploi(chercheur);
        candidature.setOffre(offre);
        candidature.setStatut(StatutCandidature.EN_ATTENTE);

        return candidatureRepository.save(candidature);
    }
     // mise a jour le statut de candidature
    public Candidature updateStatut(Long candidatureId, StatutCandidature statut) {
        Candidature candidature = candidatureRepository.findById(candidatureId)
                .orElseThrow(() -> new RuntimeException("Candidature non trouvée"));
        candidature.setStatut(statut);
        return candidatureRepository.save(candidature);
    }
     // supprimer une candidature
    public void deleteCandidature(Long id) {
        candidatureRepository.deleteById(id);
    }

    // =========================
    // Méthodes utiles
    // =========================

    public List<Candidature> getCandidaturesByChercheur(Long chercheurId) {
        return candidatureRepository.findAll().stream()
                .filter(c -> c.getChercheurEmploi() != null
                        && c.getChercheurEmploi().getId() != null
                        && c.getChercheurEmploi().getId().equals(chercheurId))
                .toList();
    }

    public List<Candidature> getCandidaturesByOffre(Long offreId) {
        return candidatureRepository.findAll().stream()
                .filter(c -> c.getOffre() != null
                        && c.getOffre().getId() != null
                        && c.getOffre().getId().equals(offreId))
                .toList();
    }

    public Candidature createCandidature(CandidatureRequest request) {
        if (request.getChercheurId() == null || request.getOffreId() == null) {
            throw new IllegalArgumentException("Les identifiants du chercheur et de l'offre sont obligatoires.");
        }

        ChercheurEmploi chercheur = chercheurEmploiRepository.findById(request.getChercheurId())
                .orElseThrow(() -> new RuntimeException("Chercheur non trouvé"));
        Offre offre = offreRepository.findById(request.getOffreId())
                .orElseThrow(() -> new RuntimeException("Offre non trouvée"));

        Candidature candidature = new Candidature();
        candidature.setChercheurEmploi(chercheur);
        candidature.setOffre(offre);
        candidature.setStatut(request.getStatut() != null ? request.getStatut() : StatutCandidature.EN_ATTENTE);

        return candidatureRepository.save(candidature);
    }

    public Candidature updateCandidature(Long id, CandidatureRequest candidatureDetails) {
        Candidature candidature = candidatureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Candidature non trouvée"));

        // Mettre à jour le chercheur si fourni
        if (candidatureDetails.getChercheurId() != null) {
            ChercheurEmploi chercheur = chercheurEmploiRepository.findById(candidatureDetails.getChercheurId())
                    .orElseThrow(() -> new RuntimeException("Chercheur non trouvé"));
            candidature.setChercheurEmploi(chercheur);
        }
        
        // Mettre à jour l'offre si fournie
        if (candidatureDetails.getOffreId() != null) {
            Offre offre = offreRepository.findById(candidatureDetails.getOffreId())
                    .orElseThrow(() -> new RuntimeException("Offre non trouvée"));
            candidature.setOffre(offre);
        }
        
        // Mettre à jour le statut si fourni
        if (candidatureDetails.getStatut() != null) {
            candidature.setStatut(candidatureDetails.getStatut());
        }

        return candidatureRepository.save(candidature);
    }
}
