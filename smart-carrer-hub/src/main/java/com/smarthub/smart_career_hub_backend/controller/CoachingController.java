package com.smarthub.smart_career_hub_backend.controller;

import com.smarthub.smart_career_hub_backend.entity.Coaching;
import com.smarthub.smart_career_hub_backend.service.CoachingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * Controller pour les Coachings
 * Note: Les coachings sont générés par le système IA.
 * Seuls les endpoints GET sont disponibles pour la consultation.
 * Pour créer des coachings, utiliser le système IA via ChercheurController: POST /api/chercheur/{id}/coaching
 */
@RestController
@RequestMapping("/api/coaching")
public class CoachingController {

    @Autowired
    private CoachingService coachingService;

    /**
     * GET - Récupérer tous les coachings (générés par le système IA)
     */
    @GetMapping
    public List<Coaching> getAll() {
        return coachingService.getAllCoachings();
    }

    /**
     * GET - Récupérer un coaching par ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Coaching> getById(@PathVariable Long id) {
        Optional<Coaching> coaching = coachingService.getCoachingById(id);
        return coaching.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * GET - Récupérer les coachings d'un chercheur
     */
    @GetMapping("/chercheur/{chercheurId}")
    public ResponseEntity<List<Coaching>> getByChercheur(@PathVariable Long chercheurId) {
        try {
            List<Coaching> coachings = coachingService.getCoachingsByChercheur(chercheurId);
            return ResponseEntity.ok(coachings);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}

