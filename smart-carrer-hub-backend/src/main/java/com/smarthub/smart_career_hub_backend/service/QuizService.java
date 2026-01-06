package com.smarthub.smart_career_hub_backend.service;


import com.smarthub.smart_career_hub_backend.dto.QuizDTO;
import com.smarthub.smart_career_hub_backend.dto.ai.AIQuizRequestDTO;
import com.smarthub.smart_career_hub_backend.dto.ai.AIQuizResponseDTO;
import com.smarthub.smart_career_hub_backend.entity.ChercheurEmploi;
import com.smarthub.smart_career_hub_backend.entity.Quiz;
import com.smarthub.smart_career_hub_backend.repository.ChercheurEmploiRepository;
import com.smarthub.smart_career_hub_backend.repository.QuizRepository;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class QuizService {

        private final QuizRepository quizRepository;
        private final ChercheurEmploiRepository chercheurEmploiRepository;
        private final AIService aiService;

        public QuizService(QuizRepository quizRepository,
                        ChercheurEmploiRepository chercheurEmploiRepository,
                        AIService aiService) {
                this.quizRepository = quizRepository;
                this.chercheurEmploiRepository = chercheurEmploiRepository;
                this.aiService = aiService;
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

        public QuizDTO generateQuizForJob(String title, String description) {
                // 1. Prepare Request to AI
                // Ensure description is not too short to avoid AI errors
                String safeDescription = (description == null || description.length() < 10)
                                ? "Job title: " + title + ". No detailed description provided."
                                : description;

                AIQuizRequestDTO aiRequest = AIQuizRequestDTO.builder()
                                .jobDescription(safeDescription)
                                .requiredSkills(Arrays.asList(title.split(" "))) // Basic skill extraction from title
                                .candidateLevel("intermediate")
                                .numQuestions(4)
                                .build();

                // 2. Call AI Service
                AIQuizResponseDTO aiResponse;
                try {
                        System.out.println("Sending request to AI Microservice: " + aiRequest);
                        aiResponse = aiService.generateQuiz(aiRequest);
                        System.out.println("Received response from AI Microservice: " + aiResponse);
                } catch (Exception e) {
                        e.printStackTrace();
                        throw new RuntimeException(
                                        "L'IA est actuellement saturée ou indisponible. Veuillez réessayer dans quelques instants. (Détail: "
                                                        + e.getMessage() + ")");
                }

                // 3. Map AI Response to your Backend DTO
                if (aiResponse == null || aiResponse.getQuestions() == null) {
                        System.err.println("CRITICAL: AI Response or questions list is NULL");
                        return QuizDTO.builder()
                                        .title("Évaluation (Fallback)")
                                        .questions(java.util.Collections.emptyList())
                                        .build();
                }

                List<QuizDTO.QuestionDTO> mappedQuestions = aiResponse.getQuestions().stream()
                                .map(q -> QuizDTO.QuestionDTO.builder()
                                                .question(q.getText() != null ? q.getText() : "Question technique")
                                                .options(q.getOptions() != null ? q.getOptions() : java.util.Arrays.asList("Option A", "Option B", "Option C", "Option D"))
                                                .correctOptionIndex(q.getCorrectAnswer())
                                                .explanation(q.getExplanation() != null ? q.getExplanation() : "")
                                                .skillArea(q.getSkill() != null ? q.getSkill() : title)
                                                .difficulty(q.getDifficulty() != null ? q.getDifficulty() : "intermediate")
                                                .build())
                                .collect(Collectors.toList());


                return QuizDTO.builder()
                                .title("AI Assessment: " + title)
                                .questions(mappedQuestions)
                                .timeLimit(aiResponse.getTimeLimit() > 0 ? aiResponse.getTimeLimit() : 120) // Default 2 mins
                                .build();
        }
}
