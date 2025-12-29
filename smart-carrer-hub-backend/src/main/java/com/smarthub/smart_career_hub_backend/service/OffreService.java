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

    public Optional<Offre> getOffreById(Long id) {
        return offreRepository.findById(id);
    }

    public Offre ajouterOffre(Long recruteurId, Offre offre) {
        Recruteur recruteur = recruteurRepository.findById(recruteurId)
                .orElseThrow(() -> new RuntimeException("Recruteur non trouvé"));
        offre.setRecruteur(recruteur);
        return offreRepository.save(offre);
    }

    public Offre updateOffre(Long id, Offre offreDetails) {
        Offre offre = offreRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Offre non trouvée"));

        offre.setTitre(offreDetails.getTitre());
        offre.setDescription(offreDetails.getDescription());
        offre.setStatut(offreDetails.getStatut());
        return offreRepository.save(offre);
    }

    public void deleteOffre(Long id) {
        offreRepository.deleteById(id);
    }


    public Offre createOffre(Offre offre) {
        return offreRepository.save(offre);
    }
}
