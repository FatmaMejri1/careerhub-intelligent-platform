package com.smarthub.smart_career_hub_backend.service;

import com.smarthub.smart_career_hub_backend.entity.ChercheurEmploi;
import com.smarthub.smart_career_hub_backend.entity.Formation;
import com.smarthub.smart_career_hub_backend.repository.ChercheurEmploiRepository;
import com.smarthub.smart_career_hub_backend.repository.FormationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FormationService {

    private final FormationRepository formationRepository;
    private final ChercheurEmploiRepository chercheurEmploiRepository;

    public FormationService(FormationRepository formationRepository, ChercheurEmploiRepository chercheurEmploiRepository) {
        this.formationRepository = formationRepository;
        this.chercheurEmploiRepository = chercheurEmploiRepository;
    }

    // Ajouter une formation
    public Formation ajouterFormation(Formation formation) {
        return formationRepository.save(formation);
    }

    // Lister toutes les formations
    public List<Formation> getAllFormations() {
        return formationRepository.findAll();
    }

    // Récupérer une formation par id
    public Optional<Formation> getFormationById(Long id) {
        return formationRepository.findById(id);
    }

    // Supprimer une formation
    public void deleteFormation(Long id) {
        formationRepository.deleteById(id);
    }

    // Ajouter un participant à une formation
    public Formation ajouterParticipant(Long formationId, Long chercheurId) {
        Formation formation = formationRepository.findById(formationId)
                .orElseThrow(() -> new RuntimeException("Formation non trouvée"));
        ChercheurEmploi chercheur = chercheurEmploiRepository.findById(chercheurId)
                .orElseThrow(() -> new RuntimeException("Chercheur non trouvé"));

        if (formation.getParticipants() == null) {
            formation.setParticipants(new java.util.ArrayList<>());
        }
        formation.getParticipants().add(chercheur);
        return formationRepository.save(formation);
    }

    // Mettre à jour une formation
    public Formation updateFormation(Long id, Formation formationDetails) {
        Formation formation = formationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Formation non trouvée"));

        formation.setNom(formationDetails.getNom());
        formation.setDescription(formationDetails.getDescription());

        return formationRepository.save(formation);
    }
}
