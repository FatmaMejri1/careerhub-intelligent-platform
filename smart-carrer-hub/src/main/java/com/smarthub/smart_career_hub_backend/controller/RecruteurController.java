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

    @GetMapping
    public List<Recruteur> getAll() {
        return recruteurService.getAllRecruteurs();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Recruteur> getById(@PathVariable Long id) {
        Optional<Recruteur> recruteur = recruteurService.getRecruteurById(id);
        return recruteur.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Recruteur> create(@RequestBody Recruteur recruteur) {
        try {
            Recruteur savedRecruteur = recruteurService.ajouterRecruteur(recruteur);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedRecruteur);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Recruteur> update(@PathVariable Long id, @RequestBody Recruteur recruteur) {
        try {
            Recruteur updatedRecruteur = recruteurService.updateRecruteur(id, recruteur);
            return ResponseEntity.ok(updatedRecruteur);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            recruteurService.deleteRecruteur(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
