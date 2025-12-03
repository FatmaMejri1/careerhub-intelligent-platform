package com.smarthub.smart_career_hub_backend.service;

import com.smarthub.smart_career_hub_backend.entity.ChercheurEmploi;
import com.smarthub.smart_career_hub_backend.entity.Offre;
import com.smarthub.smart_career_hub_backend.repository.ChercheurEmploiRepository;
import com.smarthub.smart_career_hub_backend.repository.OffreRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class SystemeIAService {

    private final ChercheurEmploiRepository chercheurEmploiRepository;
    private final OffreRepository offreRepository;

    public SystemeIAService(ChercheurEmploiRepository chercheurEmploiRepository,
                            OffreRepository offreRepository) {
        this.chercheurEmploiRepository = chercheurEmploiRepository;
        this.offreRepository = offreRepository;
    }

    // =========================
    // Matching simple offres / profils
    // =========================

    /**
     * Retourne une liste d'offres adaptées à un chercheur selon un simple scoring basé sur mots-clés.
     */
    public List<Offre> matchOffresPourChercheur(Long chercheurId) {
        ChercheurEmploi chercheur = chercheurEmploiRepository.findById(chercheurId)
                .orElseThrow(() -> new RuntimeException("Chercheur non trouvé"));

        List<Offre> toutesOffres = offreRepository.findAll();

        // Exemple de matching : si le titre de l'offre contient un mot du nom du chercheur (exemple simple)
        return toutesOffres.stream()
                .filter(offre -> offre.getTitre().toLowerCase()
                        .contains(chercheur.getNom().toLowerCase()))
                .collect(Collectors.toList());
    }

    /**
     * Retourne un score pour chaque offre par rapport à un chercheur
     */
    public Map<Offre, Integer> scorerOffresPourChercheur(Long chercheurId) {
        ChercheurEmploi chercheur = chercheurEmploiRepository.findById(chercheurId)
                .orElseThrow(() -> new RuntimeException("Chercheur non trouvé"));

        List<Offre> toutesOffres = offreRepository.findAll();
        Map<Offre, Integer> scores = new HashMap<>();

        for (Offre offre : toutesOffres) {
            int score = 0;

            // Exemple de critères de matching simple
            if (offre.getTitre().toLowerCase().contains(chercheur.getNom().toLowerCase())) {
                score += 5;
            }
            if (offre.getDescription().toLowerCase().contains(chercheur.getEmail().toLowerCase())) {
                score += 3;
            }

            scores.put(offre, score);
        }

        // Retourner les offres triées par score décroissant
        return scores.entrySet()
                .stream()
                .sorted(Map.Entry.<Offre, Integer>comparingByValue().reversed())
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue,
                        (e1, e2) -> e1,
                        LinkedHashMap::new
                ));
    }
}
