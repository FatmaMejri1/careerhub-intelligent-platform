package com.smarthub.smart_career_hub_backend.service;

import com.smarthub.smart_career_hub_backend.entity.ChercheurEmploi;
import com.smarthub.smart_career_hub_backend.entity.Quiz;
import com.smarthub.smart_career_hub_backend.repository.ChercheurEmploiRepository;
import com.smarthub.smart_career_hub_backend.repository.QuizRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class QuizService {

    private final QuizRepository quizRepository;
    private final ChercheurEmploiRepository chercheurEmploiRepository;

    public QuizService(QuizRepository quizRepository,
                       ChercheurEmploiRepository chercheurEmploiRepository) {
        this.quizRepository = quizRepository;
        this.chercheurEmploiRepository = chercheurEmploiRepository;
    }

    // =========================
    // Gestion Quiz
    // =========================

    public List<Quiz> getAllQuiz() {
        return quizRepository.findAll();
    }

    public Optional<Quiz> getQuizById(Long id) {
        return quizRepository.findById(id);
    }

    public Quiz ajouterQuiz(Long chercheurId, Quiz quiz) {
        ChercheurEmploi chercheur = chercheurEmploiRepository.findById(chercheurId)
                .orElseThrow(() -> new RuntimeException("Chercheur non trouvé"));
        quiz.setChercheurEmploi(chercheur);
        return quizRepository.save(quiz);
    }

    public Quiz updateQuiz(Long id, Quiz quizDetails) {
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quiz non trouvé"));

        quiz.setTitre(quizDetails.getTitre());
        return quizRepository.save(quiz);
    }

    public void deleteQuiz(Long id) {
        quizRepository.deleteById(id);
    }

    // =========================
    // Méthodes utiles
    // =========================

    public List<Quiz> getQuizByChercheur(Long chercheurId) {
        ChercheurEmploi chercheur = chercheurEmploiRepository.findById(chercheurId)
                .orElseThrow(() -> new RuntimeException("Chercheur non trouvé"));
        return chercheur.getQuizList();
    }
}
