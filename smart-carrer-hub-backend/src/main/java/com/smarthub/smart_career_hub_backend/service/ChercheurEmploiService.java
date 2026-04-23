package com.smarthub.smart_career_hub_backend.service;

import com.smarthub.smart_career_hub_backend.entity.ChercheurEmploi;
import com.smarthub.smart_career_hub_backend.entity.Quiz;
import com.smarthub.smart_career_hub_backend.entity.Formation;
import com.smarthub.smart_career_hub_backend.repository.ChercheurEmploiRepository;
import com.smarthub.smart_career_hub_backend.repository.QuizRepository;
import com.smarthub.smart_career_hub_backend.repository.FormationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ChercheurEmploiService {
    // Constructor injection
    private final ChercheurEmploiRepository chercheurEmploiRepository;
    private final QuizRepository quizRepository;
    private final FormationRepository formationRepository;
    private final ScoreService scoreService;
    private final GamificationService gamificationService;

    public ChercheurEmploiService(ChercheurEmploiRepository chercheurEmploiRepository,
            QuizRepository quizRepository,
            FormationRepository formationRepository,
            ScoreService scoreService,
            GamificationService gamificationService) {
        this.chercheurEmploiRepository = chercheurEmploiRepository;
        this.quizRepository = quizRepository;
        this.formationRepository = formationRepository;
        this.scoreService = scoreService;
        this.gamificationService = gamificationService;
    }

    // =========================
    // Gestion Chercheur
    // =========================
    public List<ChercheurEmploi> getAllChercheurs() {
        return chercheurEmploiRepository.findAll();
    }

    public Optional<ChercheurEmploi> getChercheurById(Long id) {
        return chercheurEmploiRepository.findById(id);
    }

    public ChercheurEmploi ajouterChercheur(ChercheurEmploi chercheur) {
        return chercheurEmploiRepository.save(chercheur);
    }

    public void deleteChercheur(Long id) {
        chercheurEmploiRepository.deleteById(id);
    }

    public ChercheurEmploi updateChercheur(Long id, ChercheurEmploi chercheurDetails) {
        ChercheurEmploi chercheur = chercheurEmploiRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Chercheur non trouvé"));

        // Basic Info
        chercheur.setNom(chercheurDetails.getNom());
        chercheur.setPrenom(chercheurDetails.getPrenom());
        chercheur.setTelephone(chercheurDetails.getTelephone());
        chercheur.setPhotoUrl(chercheurDetails.getPhotoUrl()); // Persist photo URL

        // Profile Details
        chercheur.setTitre(chercheurDetails.getTitre());
        chercheur.setAdresse(chercheurDetails.getAdresse());
        chercheur.setObjectif(chercheurDetails.getObjectif());
        
        // Track CV upload points
        if ((chercheur.getCvUrl() == null || chercheur.getCvUrl().isEmpty()) && 
            (chercheurDetails.getCvUrl() != null && !chercheurDetails.getCvUrl().isEmpty())) {
            gamificationService.addPoints(id, 30); // Upload CV rewards
        }
        chercheur.setCvUrl(chercheurDetails.getCvUrl());

        // Socials
        chercheur.setLinkedin(chercheurDetails.getLinkedin());
        chercheur.setGithub(chercheurDetails.getGithub());
        chercheur.setPortfolio(chercheurDetails.getPortfolio());

        // JSON Lists (Now stored as strings)
        chercheur.setCompetences(chercheurDetails.getCompetences());
        chercheur.setExperiences(chercheurDetails.getExperiences());
        chercheur.setEducations(chercheurDetails.getEducations());
        chercheur.setProjects(chercheurDetails.getProjects());
        chercheur.setCertifications(chercheurDetails.getCertifications());

        ChercheurEmploi saved = chercheurEmploiRepository.save(chercheur);

        // Recalculate scores
        try {
            scoreService.updateScores(saved);
        } catch (Exception e) {
            System.err.println("Error updating scores: " + e.getMessage());
        }

        System.out.println("Saved successfully with ID: " + saved.getId());
        
        // Add points for profile milestone (if completion is 100)
        if (gamificationService.calculateProfileCompletion(saved) >= 100) {
            gamificationService.addPoints(id, 100);
        } else {
            gamificationService.addPoints(id, 10); // Small reward for general update
        }

        return saved;
    }

    // =========================
    // Gestion Quiz
    // =========================
    public Quiz ajouterQuiz(Long chercheurId, Quiz quiz) {
        ChercheurEmploi chercheur = chercheurEmploiRepository.findById(chercheurId)
                .orElseThrow(() -> new RuntimeException("Chercheur non trouvé"));
        quiz.setChercheurEmploi(chercheur);
        Quiz savedQuiz = quizRepository.save(quiz);

        // Gamification: Pass quiz
        if (savedQuiz.getScore() != null && savedQuiz.getScore() >= 50) {
            gamificationService.addPoints(chercheurId, 40); // Pass
            if (savedQuiz.getScore() >= 90) {
                gamificationService.addPoints(chercheurId, 60); // High score BONUS
            }
        }
        
        return savedQuiz;
    }

    public List<Quiz> getQuizByChercheur(Long chercheurId) {
        ChercheurEmploi chercheur = chercheurEmploiRepository.findById(chercheurId)
                .orElseThrow(() -> new RuntimeException("Chercheur non trouvé"));
        return chercheur.getQuizList();
    }


    // =========================
    // Gestion Formations
    // =========================
    public Formation ajouterFormation(Long chercheurId, Formation formation) {
        ChercheurEmploi chercheur = chercheurEmploiRepository.findById(chercheurId)
                .orElseThrow(() -> new RuntimeException("Chercheur non trouvé"));
        formation.getParticipants().add(chercheur);
        return formationRepository.save(formation);
    }


    public List<Formation> getFormationsByChercheur(Long chercheurId) {
        ChercheurEmploi chercheur = chercheurEmploiRepository.findById(chercheurId)
                .orElseThrow(() -> new RuntimeException("Chercheur non trouvé"));
        return chercheur.getFormations();
    }
}
