package com.smarthub.smart_career_hub_backend.controller;

import com.smarthub.smart_career_hub_backend.entity.ChercheurEmploi;
import com.smarthub.smart_career_hub_backend.entity.Quiz;
import com.smarthub.smart_career_hub_backend.entity.Coaching;
import com.smarthub.smart_career_hub_backend.entity.Formation;
import com.smarthub.smart_career_hub_backend.service.ChercheurEmploiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/chercheur")
public class ChercheurController {

    @Autowired
    private ChercheurEmploiService chercheurEmploiService;

    @GetMapping
    public List<ChercheurEmploi> getAll() {
        return chercheurEmploiService.getAllChercheurs();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChercheurEmploi> getById(@PathVariable Long id) {
        Optional<ChercheurEmploi> chercheur = chercheurEmploiService.getChercheurById(id);
        return chercheur.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ChercheurEmploi> create(@RequestBody ChercheurEmploi chercheur) {
        try {
            ChercheurEmploi savedChercheur = chercheurEmploiService.ajouterChercheur(chercheur);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedChercheur);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ChercheurEmploi> update(@PathVariable Long id, @RequestBody ChercheurEmploi chercheur) {
        try {
            ChercheurEmploi updatedChercheur = chercheurEmploiService.updateChercheur(id, chercheur);
            return ResponseEntity.ok(updatedChercheur);
        } catch (RuntimeException e) {
            if (e.getMessage() != null && e.getMessage().contains("non trouvé")) {
                 return ResponseEntity.notFound().build();
            }
            System.err.println("Error updating chercheur: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            chercheurEmploiService.deleteChercheur(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Endpoints spécifiques pour les fonctionnalités chercheur

    @PostMapping("/{chercheurId}/quiz")
    public ResponseEntity<Quiz> ajouterQuiz(@PathVariable Long chercheurId, @RequestBody Quiz quiz) {
        try {
            Quiz savedQuiz = chercheurEmploiService.ajouterQuiz(chercheurId, quiz);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedQuiz);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{chercheurId}/quiz")
    public ResponseEntity<List<Quiz>> getQuizByChercheur(@PathVariable Long chercheurId) {
        try {
            List<Quiz> quizList = chercheurEmploiService.getQuizByChercheur(chercheurId);
            return ResponseEntity.ok(quizList);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{chercheurId}/coaching")
    public ResponseEntity<Coaching> ajouterCoaching(@PathVariable Long chercheurId, @RequestBody Coaching coaching) {
        try {
            Coaching savedCoaching = chercheurEmploiService.ajouterCoaching(chercheurId, coaching);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedCoaching);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{chercheurId}/coaching")
    public ResponseEntity<List<Coaching>> getCoachingsByChercheur(@PathVariable Long chercheurId) {
        try {
            List<Coaching> coachings = chercheurEmploiService.getCoachingsByChercheur(chercheurId);
            return ResponseEntity.ok(coachings);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}