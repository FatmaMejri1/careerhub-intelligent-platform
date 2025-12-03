package com.smarthub.smart_career_hub_backend.service;

import com.smarthub.smart_career_hub_backend.entity.Gamification;
import com.smarthub.smart_career_hub_backend.entity.ChercheurEmploi;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class GamificationService {

    // Exemple simple : calcul de gamification en mémoire
    public List<Gamification> calculerGamification(ChercheurEmploi chercheur) {
        List<Gamification> gamifications = new ArrayList<>();

        // Exemple : générer des points et badges
        Gamification score = new Gamification();
        score.setPoints(chercheur.getQuizList() != null ? chercheur.getQuizList().size() * 10 : 0); // 10 points par quiz
        score.setType("Badge");
        score.setDescription("Débutant");

        gamifications.add(score);

        return gamifications;
    }
}
