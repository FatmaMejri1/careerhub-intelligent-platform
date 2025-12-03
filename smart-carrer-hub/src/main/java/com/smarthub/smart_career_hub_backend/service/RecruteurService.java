package com.smarthub.smart_career_hub_backend.service;

import com.smarthub.smart_career_hub_backend.entity.Offre;
import com.smarthub.smart_career_hub_backend.entity.Recruteur;
import com.smarthub.smart_career_hub_backend.repository.RecruteurRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RecruteurService {

    private final RecruteurRepository recruteurRepository;

    public RecruteurService(RecruteurRepository recruteurRepository) {
        this.recruteurRepository = recruteurRepository;
    }

    // =========================
    // Gestion Recruteur
    // =========================

    public List<Recruteur> getAllRecruteurs() {
        return recruteurRepository.findAll();
    }

    public Optional<Recruteur> getRecruteurById(Long id) {
        return recruteurRepository.findById(id);
    }

    public Recruteur ajouterRecruteur(Recruteur recruteur) {
        return recruteurRepository.save(recruteur);
    }

    public Recruteur updateRecruteur(Long id, Recruteur recruteurDetails) {
        Recruteur recruteur = recruteurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recruteur non trouvé"));

        recruteur.setNom(recruteurDetails.getNom());
        recruteur.setPrenom(recruteurDetails.getPrenom());
        recruteur.setEmail(recruteurDetails.getEmail());
        recruteur.setMotDePasse(recruteurDetails.getMotDePasse());
        recruteur.setRole(recruteurDetails.getRole());

        return recruteurRepository.save(recruteur);
    }

    public void deleteRecruteur(Long id) {
        recruteurRepository.deleteById(id);
    }

    // =========================
    // Méthodes utiles
    // =========================

    public List<Offre> getOffresByRecruteur(Long id) {
        Recruteur recruteur = recruteurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recruteur non trouvé"));
        return recruteur.getOffres();
    }

    public Recruteur createRecruteur(Recruteur recruteur) {
        return recruteurRepository.save(recruteur);
    }
}
