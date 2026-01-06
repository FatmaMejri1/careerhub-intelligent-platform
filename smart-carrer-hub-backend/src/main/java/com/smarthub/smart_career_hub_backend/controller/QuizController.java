package com.smarthub.smart_career_hub_backend.controller;

import com.smarthub.smart_career_hub_backend.dto.QuizDTO;
import com.smarthub.smart_career_hub_backend.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/quiz")
public class QuizController {

    @Autowired
    private QuizService quizService;

    @PostMapping("/generate")
    public QuizDTO generateQuiz(@RequestBody java.util.Map<String, String> request) {
        System.out.println("DEBUG: Quiz Generation Request Received: " + request);
        String title = request.getOrDefault("title", "Poste");
        String description = request.getOrDefault("description", "");
        System.out.println("DEBUG: Generating quiz for Title: " + title);
        QuizDTO result = quizService.generateQuizForJob(title, description);
        System.out.println("DEBUG: Quiz Generated Successfully: " + (result != null ? result.getQuestions().size() : 0)
                + " questions");
        return result;
    }
}
