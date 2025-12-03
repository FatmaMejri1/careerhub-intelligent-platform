package com.smarthub.smart_career_hub_backend.controller;

import com.smarthub.smart_career_hub_backend.entity.Formation;
import com.smarthub.smart_career_hub_backend.service.FormationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * Controller pour les Formations
 * Note: Les formations sont générées par le système IA.
 * Seuls les endpoints GET sont disponibles pour la consultation.
 * Pour créer/modifier des formations, utiliser le système IA via ChercheurController.
 */
@RestController
@RequestMapping("/api/formation")
public class FormationController {

    @Autowired
    private FormationService formationService;

    /**
     * GET - Récupérer toutes les formations (générées par le système IA)
     */
    @GetMapping
    public List<Formation> getAll() {
        return formationService.getAllFormations();
    }

    /**
     * GET - Récupérer une formation par ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Formation> getById(@PathVariable Long id) {
        Optional<Formation> formation = formationService.getFormationById(id);
        return formation.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

