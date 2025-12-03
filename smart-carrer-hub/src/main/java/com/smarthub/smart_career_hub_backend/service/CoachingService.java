package com.smarthub.smart_career_hub_backend.service;

import com.smarthub.smart_career_hub_backend.entity.ChercheurEmploi;
import com.smarthub.smart_career_hub_backend.entity.Coaching;
import com.smarthub.smart_career_hub_backend.repository.ChercheurEmploiRepository;
import com.smarthub.smart_career_hub_backend.repository.CoachingRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CoachingService {

    private final CoachingRepository coachingRepository;
    private final ChercheurEmploiRepository chercheurEmploiRepository;

    public CoachingService(CoachingRepository coachingRepository,
                           ChercheurEmploiRepository chercheurEmploiRepository) {
        this.coachingRepository = coachingRepository;
        this.chercheurEmploiRepository = chercheurEmploiRepository;
    }

    // =========================
    // Gestion Coaching
    // =========================

    public List<Coaching> getAllCoachings() {
        return coachingRepository.findAll();
    }

    public Optional<Coaching> getCoachingById(Long id) {
        return coachingRepository.findById(id);
    }

    public Coaching ajouterCoaching(Long chercheurId, Coaching coaching) {
        ChercheurEmploi chercheur = chercheurEmploiRepository.findById(chercheurId)
                .orElseThrow(() -> new RuntimeException("Chercheur non trouvé"));
        coaching.setChercheurEmploi(chercheur);
        return coachingRepository.save(coaching);
    }

    public Coaching updateCoaching(Long id, Coaching coachingDetails) {
        Coaching coaching = coachingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Coaching non trouvé"));

        coaching.setConseil(coachingDetails.getConseil());
        return coachingRepository.save(coaching);
    }

    public void deleteCoaching(Long id) {
        coachingRepository.deleteById(id);
    }

    // =========================
    // Méthodes utiles
    // =========================

    public List<Coaching> getCoachingsByChercheur(Long chercheurId) {
        ChercheurEmploi chercheur = chercheurEmploiRepository.findById(chercheurId)
                .orElseThrow(() -> new RuntimeException("Chercheur non trouvé"));
        return chercheur.getCoachings();
    }
}
