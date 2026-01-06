package com.smarthub.smart_career_hub_backend.service;

import com.smarthub.smart_career_hub_backend.entity.ChercheurEmploi;
import com.smarthub.smart_career_hub_backend.entity.Quiz;
import com.smarthub.smart_career_hub_backend.entity.Coaching;
import com.smarthub.smart_career_hub_backend.entity.Formation;
import com.smarthub.smart_career_hub_backend.entity.Gamification;
import com.smarthub.smart_career_hub_backend.repository.ChercheurEmploiRepository;
import com.smarthub.smart_career_hub_backend.repository.QuizRepository;
import com.smarthub.smart_career_hub_backend.repository.CoachingRepository;
import com.smarthub.smart_career_hub_backend.repository.FormationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ChercheurEmploiService {
//Constructor injection
    private final ChercheurEmploiRepository chercheurEmploiRepository;
    private final QuizRepository quizRepository;
    private final CoachingRepository coachingRepository;
    private final FormationRepository formationRepository;
    private final ScoreService scoreService;

    public ChercheurEmploiService(ChercheurEmploiRepository chercheurEmploiRepository,
                                  QuizRepository quizRepository,
                                  CoachingRepository coachingRepository,
                                  FormationRepository formationRepository,
                                  ScoreService scoreService) {
        this.chercheurEmploiRepository = chercheurEmploiRepository;
        this.quizRepository = quizRepository;
        this.coachingRepository = coachingRepository;
        this.formationRepository = formationRepository;
        this.scoreService = scoreService;
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
        return saved;
    }

    // =========================
    // Gestion Quiz
    // =========================
    public Quiz ajouterQuiz(Long chercheurId, Quiz quiz) {
        ChercheurEmploi chercheur = chercheurEmploiRepository.findById(chercheurId)
                .orElseThrow(() -> new RuntimeException("Chercheur non trouvé"));
        quiz.setChercheurEmploi(chercheur);
        return quizRepository.save(quiz);
    }

    public List<Quiz> getQuizByChercheur(Long chercheurId) {
        ChercheurEmploi chercheur = chercheurEmploiRepository.findById(chercheurId)
                .orElseThrow(() -> new RuntimeException("Chercheur non trouvé"));
        return chercheur.getQuizList();
    }

    // =========================
    // Gestion Coaching
    // =========================
    public Coaching ajouterCoaching(Long chercheurId, Coaching coaching) {
        ChercheurEmploi chercheur = chercheurEmploiRepository.findById(chercheurId)
                .orElseThrow(() -> new RuntimeException("Chercheur non trouvé"));
        coaching.setChercheurEmploi(chercheur);
        return coachingRepository.save(coaching);
    }

    public List<Coaching> getCoachingsByChercheur(Long chercheurId) {
        ChercheurEmploi chercheur = chercheurEmploiRepository.findById(chercheurId)
                .orElseThrow(() -> new RuntimeException("Chercheur non trouvé"));
        return chercheur.getCoachings();
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

    // =========================
    // Gestion Gamification (Dynamique)
    // =========================
    public Gamification genererGamification(ChercheurEmploi chercheur) {
        Gamification gamification = new Gamification();
        gamification.setPoints(chercheur.getQuizList() != null ? chercheur.getQuizList().size() * 10 : 0); // Exemple simple
        gamification.setType("Badge");
        gamification.setDescription("Débutant");
        gamification.setChercheurEmploi(chercheur);
        return gamification; // Ne pas sauvegarder en DB
    }

    public ChercheurEmploi createChercheur(ChercheurEmploi chercheur) {
        return chercheur;
    }
}
