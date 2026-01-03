package com.smarthub.smart_career_hub_backend.service;

import com.smarthub.smart_career_hub_backend.entity.Offre;
import com.smarthub.smart_career_hub_backend.entity.Recruteur;
import com.smarthub.smart_career_hub_backend.repository.OffreRepository;
import com.smarthub.smart_career_hub_backend.repository.RecruteurRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OffreService {

    private final OffreRepository offreRepository;
    private final RecruteurRepository recruteurRepository;

    public OffreService(OffreRepository offreRepository,
            RecruteurRepository recruteurRepository) {
        this.offreRepository = offreRepository;
        this.recruteurRepository = recruteurRepository;
    }

    public List<Offre> getAllOffres() {
        return offreRepository.findAll();
    }

    public List<Offre> getOffresByRecruteur(Long recruteurId) {
        return offreRepository.findByRecruteur_Id(recruteurId);
    }

    public Optional<Offre> getOffreById(Long id) {
        return offreRepository.findById(id);
    }

    public Offre ajouterOffre(Long recruteurId, Offre offre) {
        Recruteur recruteur = recruteurRepository.findById(recruteurId)
                .orElseThrow(() -> new RuntimeException("Recruteur non trouvé"));
        offre.setRecruteur(recruteur);
        return offreRepository.save(offre);
    }

    @org.springframework.transaction.annotation.Transactional
    public Offre updateOffre(Long id, Offre offreDetails) {
        System.out.println("Updating offer ID: " + id);
        Offre offre = offreRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Offre non trouvée with ID: " + id));

        offre.setTitre(offreDetails.getTitre());
        offre.setDescription(offreDetails.getDescription());
        offre.setStatut(offreDetails.getStatut());

        if (offreDetails.getType() != null) {
            offre.setType(offreDetails.getType());
        }
        if (offreDetails.getLocation() != null) {
            offre.setLocation(offreDetails.getLocation());
        }

        return offreRepository.save(offre);
    }

    @org.springframework.transaction.annotation.Transactional
    public void deleteOffre(Long id) {
        System.out.println("Deleting offer ID: " + id);
        if (offreRepository.existsById(id)) {
            offreRepository.deleteById(id);
        } else {
            System.err.println("Attempted to delete non-existent offer ID: " + id);
        }
    }

    @org.springframework.transaction.annotation.Transactional
    public Offre createOffre(Offre offre) {
        System.out.println("Creating new offer: " + offre.getTitre());

        // Handle recruiter linking if ID is provided
        if (offre.getRecruteurIdTransient() != null) {
            System.out.println("Searching for recruiter ID: " + offre.getRecruteurIdTransient());
            Recruteur recruteur = recruteurRepository.findById(offre.getRecruteurIdTransient())
                    .orElse(null);
            if (recruteur != null) {
                System.out.println("Recruiter found: " + recruteur.getNom());
                offre.setRecruteur(recruteur);
            } else {
                System.err.println("CRITICAL: Recruiter not found for ID: " + offre.getRecruteurIdTransient());
            }
        }

        // Set creation date if not already set
        if (offre.getDateCreation() == null) {
            offre.setDateCreation(java.time.LocalDateTime.now());
        }

        Offre saved = offreRepository.save(offre);
        System.out.println("Offer saved successfully with ID: " + saved.getId());
        return saved;
    }
}
