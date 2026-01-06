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

    @PostMapping(value = "/chercheur/{chercheurId}/offre/{offreId}", consumes = { "multipart/form-data" })
    public ResponseEntity<Candidature> createCandidature(
            @PathVariable Long chercheurId,
            @PathVariable Long offreId,
            @RequestParam(required = false) Double score,
            @RequestParam(value = "cv", required = false) org.springframework.web.multipart.MultipartFile cvFile,
            @RequestParam(value = "letter", required = false) String letter) {
        try {
            String cvUrl = null;
            if (cvFile != null && !cvFile.isEmpty()) {
                // Simple local file save
                String uploadDir = "uploads/cvs/";
                java.io.File directory = new java.io.File(uploadDir);
                if (!directory.exists()) {
                    directory.mkdirs();
                }
                String fileName = java.util.UUID.randomUUID().toString() + "_" + cvFile.getOriginalFilename();
                java.nio.file.Path filePath = java.nio.file.Paths.get(uploadDir + fileName);
                java.nio.file.Files.write(filePath, cvFile.getBytes());
                cvUrl = "/uploads/cvs/" + fileName;
            }

            Candidature candidature = candidatureService.ajouterCandidature(chercheurId, offreId, score, cvUrl, letter);
            return ResponseEntity.status(HttpStatus.CREATED).body(candidature);
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            e.printStackTrace();
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

    @GetMapping("/recruteur/{recruteurId}")
    public ResponseEntity<?> getCandidaturesByRecruteur(@PathVariable Long recruteurId) {
        try {
            List<Candidature> candidatures = candidatureService.getCandidaturesByRecruteur(recruteurId);
            // Manuel mapping to avoid circular dependencies during testing
            List<java.util.Map<String, Object>> result = candidatures.stream().map(c -> {
                java.util.Map<String, Object> map = new java.util.HashMap<>();
                map.put("id", c.getId());
                map.put("statut", c.getStatut());
                map.put("quizScore", c.getQuizScore());
                System.out.println("DEBUG: Mapping candidature " + c.getId() + " - cvUrl: " + c.getCvUrl());
                map.put("dateCreation", c.getOffre() != null ? c.getOffre().getDateCreation() : null);

                if (c.getOffre() != null) {
                    java.util.Map<String, Object> offreMap = new java.util.HashMap<>();
                    offreMap.put("id", c.getOffre().getId());
                    offreMap.put("titre", c.getOffre().getTitre());
                    map.put("offre", offreMap);
                }

                if (c.getChercheurEmploi() != null) {
                    java.util.Map<String, Object> ceMap = new java.util.HashMap<>();
                    ceMap.put("id", c.getChercheurEmploi().getId());
                    ceMap.put("nom", c.getChercheurEmploi().getNom());
                    ceMap.put("prenom", c.getChercheurEmploi().getPrenom());
                    ceMap.put("email", c.getChercheurEmploi().getEmail());
                    ceMap.put("competences", c.getChercheurEmploi().getCompetences());
                    ceMap.put("experiences", c.getChercheurEmploi().getExperiences());
                    ceMap.put("educations", c.getChercheurEmploi().getEducations());
                    ceMap.put("niveauExperience", c.getChercheurEmploi().getNiveauExperience());
                    ceMap.put("employabilityScore", c.getChercheurEmploi().getEmployabilityScore());
                    ceMap.put("fraudScore", c.getChercheurEmploi().getFraudScore());
                    ceMap.put("cvUrl", c.getChercheurEmploi().getCvUrl());
                    map.put("chercheurEmploi", ceMap);
                }
                map.put("cvUrl", c.getCvUrl());

                return map;
            }).toList();
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}