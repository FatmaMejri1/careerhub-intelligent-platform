package com.smarthub.smart_career_hub_backend.controller;

import com.smarthub.smart_career_hub_backend.entity.Recruteur;
import com.smarthub.smart_career_hub_backend.service.RecruteurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/recruteur")
public class RecruteurController {

    @Autowired
    private RecruteurService recruteurService;

    // =========================
    // GET all recruteurs
    // =========================
    @GetMapping
    public ResponseEntity<List<Recruteur>> getAll() {
        List<Recruteur> recruteurs = recruteurService.getAllRecruteurs();
        return ResponseEntity.ok(recruteurs);
    }

    // =========================
    // GET by ID
    // =========================
    @GetMapping("/{id}")
    public ResponseEntity<Recruteur> getById(@PathVariable Long id) {
        Optional<Recruteur> recruteur = recruteurService.getRecruteurById(id);
        return recruteur.map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }

    // =========================
    // CREATE recruteur
    // =========================
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Recruteur recruteur) {
        try {
            Recruteur savedRecruteur = recruteurService.createRecruteur(recruteur);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedRecruteur);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error creating recruiter: " + e.getMessage());
        }
    }

    @PutMapping("/promote/{id}")
    public ResponseEntity<?> promote(@PathVariable Long id, @RequestBody Recruteur recruteur) {
        try {
            Recruteur promoted = recruteurService.promoteUserToRecruiter(id, recruteur);
            return ResponseEntity.ok(promoted);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error promoting user: " + e.getMessage());
        }
    }

    // =========================
    // UPDATE recruteur
    // =========================
    @PutMapping("/{id}")
    public ResponseEntity<Recruteur> update(@PathVariable Long id, @RequestBody Recruteur recruteur) {
        try {
            Recruteur updatedRecruteur = recruteurService.updateRecruteur(id, recruteur);
            return ResponseEntity.ok(updatedRecruteur);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // =========================
    // DELETE recruteur
    // =========================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            recruteurService.deleteRecruteur(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // =========================
    // UPDATE profile image
    // =========================
    @PutMapping("/{id}/profile-image")
    public ResponseEntity<Void> updateProfileImage(@PathVariable Long id, @RequestBody String base64Image) {
        try {
            recruteurService.updateProfileImage(id, base64Image);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping("/recommendations/{id}")
    public ResponseEntity<List<java.util.Map<String, Object>>> getRecommendations(@PathVariable Long id) {
        return ResponseEntity.ok(recruteurService.getRecommendedCandidates(id));
    }
}
