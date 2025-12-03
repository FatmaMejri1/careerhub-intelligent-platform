package com.smarthub.smart_career_hub_backend.controller;

import com.smarthub.smart_career_hub_backend.dto.CandidatureRequest;
import com.smarthub.smart_career_hub_backend.entity.Candidature;
import com.smarthub.smart_career_hub_backend.enums.StatutCandidature;
import com.smarthub.smart_career_hub_backend.service.CandidatureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/candidature")
public class CandidatureController {

    @Autowired
    private CandidatureService candidatureService;

    @GetMapping
    public List<Candidature> getAll() {
        return candidatureService.getAllCandidatures();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Candidature> getById(@PathVariable Long id) {
        Optional<Candidature> candidature = candidatureService.getCandidatureById(id);
        return candidature.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Candidature> create(@RequestBody CandidatureRequest request) {
        try {
            Candidature saved = candidatureService.createCandidature(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/chercheur/{chercheurId}/offre/{offreId}")
    public ResponseEntity<Candidature> createCandidature(
            @PathVariable Long chercheurId,
            @PathVariable Long offreId) {
        try {
            Candidature candidature = candidatureService.ajouterCandidature(chercheurId, offreId);
            return ResponseEntity.status(HttpStatus.CREATED).body(candidature);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/{id}/statut")
    public ResponseEntity<Candidature> updateStatut(
            @PathVariable Long id,
            @RequestParam StatutCandidature statut) {
        try {
            Candidature updatedCandidature = candidatureService.updateStatut(id, statut);
            return ResponseEntity.ok(updatedCandidature);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Candidature> update(@PathVariable Long id, @RequestBody CandidatureRequest candidature) {
        try {
            Candidature updated = candidatureService.updateCandidature(id, candidature);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            candidatureService.deleteCandidature(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Méthodes utilitaires
    @GetMapping("/chercheur/{chercheurId}")
    public ResponseEntity<List<Candidature>> getCandidaturesByChercheur(@PathVariable Long chercheurId) {
        try {
            List<Candidature> candidatures = candidatureService.getCandidaturesByChercheur(chercheurId);
            return ResponseEntity.ok(candidatures);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/offre/{offreId}")
    public ResponseEntity<List<Candidature>> getCandidaturesByOffre(@PathVariable Long offreId) {
        try {
            List<Candidature> candidatures = candidatureService.getCandidaturesByOffre(offreId);
            return ResponseEntity.ok(candidatures);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}