package com.smarthub.smart_career_hub_backend.controller;

import com.smarthub.smart_career_hub_backend.entity.Offre;
import com.smarthub.smart_career_hub_backend.service.OffreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/offre")
public class OffreController {

    @Autowired
    private OffreService offreService;

    @GetMapping
    public List<com.smarthub.smart_career_hub_backend.dto.OffreDTO> getAll() {
        return offreService.getAllOffres().stream().map(o -> {
            com.smarthub.smart_career_hub_backend.dto.OffreDTO dto = new com.smarthub.smart_career_hub_backend.dto.OffreDTO();
            dto.setId(o.getId());
            dto.setTitre(o.getTitre());
            dto.setDescription(o.getDescription());
            dto.setType(o.getType());
            dto.setLocation(o.getLocation());
            dto.setStatut(o.getStatut() != null ? o.getStatut().name() : "ACTIVE");
            dto.setDateCreation(o.getDateCreation());
            if (o.getRecruteur() != null) {
                dto.setRecruteurId(o.getRecruteur().getId());
                dto.setNomEntreprise(o.getRecruteur().getNomEntreprise());
            }
            return dto;
        }).toList();
    }

    @GetMapping("/recruteur/{recruteurId}")
    public ResponseEntity<List<java.util.Map<String, Object>>> getByRecruteur(@PathVariable Long recruteurId) {
        System.out.println("DEBUG: Fetching offers for recruiter ID: " + recruteurId);
        List<Offre> offres = offreService.getOffresByRecruteur(recruteurId);
        System.out.println("DEBUG: Found " + offres.size() + " offers for recruiter " + recruteurId);
        List<java.util.Map<String, Object>> result = offres.stream().map(offre -> {
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", offre.getId());
            map.put("titre", offre.getTitre());
            map.put("description", offre.getDescription());
            map.put("type", offre.getType());
            map.put("location", offre.getLocation());
            map.put("statut", offre.getStatut());
            map.put("dateCreation", offre.getDateCreation());

            // Calculate application count safely
            int appCount = 0;
            if (offre.getCandidatures() != null) {
                appCount = offre.getCandidatures().size();
            }
            map.put("applicationsCount", appCount);

            // Real performance score
            map.put("performanceScore", calculateQualityScore(offre));

            return map;
        }).toList();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public Optional<Offre> getById(@PathVariable Long id) {
        return offreService.getOffreById(id);
    }

    @PostMapping
    public Offre create(@RequestBody Offre offre) {
        return offreService.createOffre(offre);
    }

    @PutMapping("/{id}")
    public Offre update(@PathVariable Long id, @RequestBody Offre offre) {
        return offreService.updateOffre(id, offre);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        offreService.deleteOffre(id);
    }

    @GetMapping("/admin")
    public ResponseEntity<List<java.util.Map<String, Object>>> getAllForAdmin() {
        List<Offre> offres = offreService.getAllOffres();
        List<java.util.Map<String, Object>> result = offres.stream().map(offre -> {
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", offre.getId());
            map.put("title", offre.getTitre());
            // Safe Recruteur Access
            if (offre.getRecruteur() != null) {
                map.put("company",
                        offre.getRecruteur().getNomEntreprise() != null ? offre.getRecruteur().getNomEntreprise()
                                : "Unknown");
            } else {
                map.put("company", "Unknown");
            }
            map.put("sector", offre.getType()); // Using type as sector for now
            map.put("date", offre.getDateCreation());
            map.put("description", offre.getDescription());
            map.put("contract", offre.getType());
            // Status mapping
            map.put("status", offre.getStatut());

            // Calculate application count safely
            int appCount = 0;
            if (offre.getCandidatures() != null) {
                appCount = offre.getCandidatures().size();
            }
            map.put("applications", appCount);

            // Real quality score based on completeness and engagement
            map.put("qualityScore", calculateQualityScore(offre));

            // Missing: Salary, Skills (Mock for now or extract from description?)
            map.put("salary", "Confidential"); // Placeholder
            map.put("skills", java.util.Collections.emptyList()); // Placeholder

            return map;
        }).toList();
        return ResponseEntity.ok(result);
    }

    private int calculateQualityScore(Offre offre) {
        int score = 0;

        // 1. Completeness (Base 50%)
        if (offre.getTitre() != null && !offre.getTitre().isEmpty())
            score += 10;
        if (offre.getLocation() != null && !offre.getLocation().isEmpty())
            score += 10;
        if (offre.getType() != null && !offre.getType().isEmpty())
            score += 10;
        if (offre.getDescription() != null) {
            if (offre.getDescription().length() > 50)
                score += 10;
            if (offre.getDescription().length() > 200)
                score += 10; // Detailed description bonus
        }

        // 2. Engagement (Bonus 40%)
        try {
            if (offre.getCandidatures() != null) {
                // max 40 points
                score += Math.min(40, offre.getCandidatures().size() * 5);
            }
        } catch (Exception e) {
            // Ignore lazy init exception, assume 0
        }

        // 3. Recruiter Reputation / Completeness (Bonus 10%)
        if (offre.getRecruteur() != null && offre.getRecruteur().getNomEntreprise() != null) {
            score += 10;
        }

        return Math.max(20, Math.min(100, score));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam("status") String status) {
        try {
            Optional<Offre> optionalOffre = offreService.getOffreById(id);
            if (optionalOffre.isEmpty())
                return ResponseEntity.notFound().build();

            Offre offre = optionalOffre.get();

            // Handle encoded strings and accents robustly
            String raw = status != null ? status.trim().toUpperCase() : "";
            String elem = raw;

            // Use partial matching (stems) to avoid accent issues
            if (raw.contains("BLOQU")) {
                elem = "BLOQUEE";
            } else if (raw.contains("SIGNAL")) {
                elem = "SIGNALEE";
            } else if (raw.contains("EXPIR") || raw.contains("CLOTUR") || raw.contains("FERM")) {
                elem = "CLOTUREE";
            } else if (raw.contains("ACTIV") || raw.contains("VALID")) {
                elem = "ACTIVE";
            }

            try {
                offre.setStatut(com.smarthub.smart_career_hub_backend.enums.StatutOffre.valueOf(elem));
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body("Status Mapping Failed. Received: '" + status + "' mapped to: '"
                        + elem + "'. Expected one of: ACTIVE, CLOTUREE, SIGNALEE, BLOQUEE");
            }

            offreService.createOffre(offre); // Saves content
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating status: " + e.getMessage());
        }
    }
}
