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
    public List<Offre> getAll() {
        return offreService.getAllOffres();
    }

    @GetMapping("/recruteur/{recruteurId}")
    public ResponseEntity<List<java.util.Map<String, Object>>> getByRecruteur(@PathVariable Long recruteurId) {
        List<Offre> offres = offreService.getOffresByRecruteur(recruteurId);
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

            // Mock performance score (random 70-100 for "premium" feel)
            map.put("performanceScore", 70 + (int) (Math.random() * 30));

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
}
