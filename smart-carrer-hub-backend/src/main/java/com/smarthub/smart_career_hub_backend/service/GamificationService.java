package com.smarthub.smart_career_hub_backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smarthub.smart_career_hub_backend.entity.*;
import com.smarthub.smart_career_hub_backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GamificationService {

    private final UserPointsRepository userPointsRepository;
    private final BadgeRepository badgeRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final ObjectMapper objectMapper;

    /**
     * Calculates profile completion percentage for a candidate
     */
    public int calculateProfileCompletion(ChercheurEmploi c) {
        int score = 0;

        if (c.getCvUrl() != null && !c.getCvUrl().isEmpty()) score += 20;
        if (hasData(c.getCompetences())) score += 15;
        if (hasData(c.getExperiences())) score += 15;
        if (hasData(c.getEducations())) score += 15;
        if (hasData(c.getProjects())) score += 10;
        if (c.getLinkedin() != null && !c.getLinkedin().isEmpty()) score += 10;
        if (c.getGithub() != null && !c.getGithub().isEmpty()) score += 10;
        if (c.getPortfolio() != null && !c.getPortfolio().isEmpty()) score += 5;

        return Math.min(score, 100);
    }

    private boolean hasData(String data) {
        if (data == null || data.isEmpty()) return false;
        try {
            // Try as JSON list first
            List<?> list = objectMapper.readValue(data, List.class);
            return !list.isEmpty();
        } catch (Exception e) {
            // Fallback to simple non-empty string check
            return data.length() > 5; // Assume at least 5 chars for meaningful data
        }
    }

    /**
     * Adds points to a user and checks for level up
     */
    @Transactional
    public UserPoints addPoints(Long userId, int points) {
        Utilisateur user = utilisateurRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        UserPoints up = userPointsRepository.findByUtilisateur(user)
                .orElseGet(() -> {
                    UserPoints newUp = new UserPoints();
                    newUp.setUtilisateur(user);
                    return newUp;
                });

        up.setTotalPoints(up.getTotalPoints() + points);
        updateLevel(up);
        
        UserPoints saved = userPointsRepository.save(up);
        checkAndAwardBadges(user);
        return saved;
    }

    private void updateLevel(UserPoints up) {
        int pts = up.getTotalPoints();
        if (pts >= 2000) {
            up.setExperienceLevel(5);
            up.setLevelName("Elite Candidate");
        } else if (pts >= 1000) {
            up.setExperienceLevel(4);
            up.setLevelName("Expert");
        } else if (pts >= 500) {
            up.setExperienceLevel(3);
            up.setLevelName("Professional");
        } else if (pts >= 200) {
            up.setExperienceLevel(2);
            up.setLevelName("Explorer");
        } else {
            up.setExperienceLevel(1);
            up.setLevelName("Beginner");
        }
    }

    @Transactional
    public void checkAndAwardBadges(Utilisateur user) {
        if (user instanceof ChercheurEmploi) {
            ChercheurEmploi candidate = (ChercheurEmploi) user;
            List<Badge> currentBadges = user.getBadges();
            if (currentBadges == null) {
                currentBadges = new ArrayList<>();
                user.setBadges(currentBadges);
            }

            // 1. Profile Master (100% completion)
            if (calculateProfileCompletion(candidate) >= 100) {
                awardBadgeIfNotPresent(user, "Profile Master", "Profil complété à 100%", "fas fa-user-check");
            }

            // 2. Quiz Champion (High score)
            boolean hasChampionScore = false;
            if (candidate.getQuizList() != null) {
                hasChampionScore = candidate.getQuizList().stream()
                        .anyMatch(q -> q.getScore() != null && q.getScore() >= 90);
            }
            if (hasChampionScore) {
                awardBadgeIfNotPresent(user, "Quiz Champion", "Score > 90 dans un quiz", "fas fa-trophy");
            }
            
            // 3. Fast Learner (3+ quizzes)
            if (candidate.getQuizList() != null && candidate.getQuizList().size() >= 3) {
                 awardBadgeIfNotPresent(user, "Fast Learner", "A passé au moins 3 quizzes", "fas fa-bolt");
            }
        }
    }

    private void awardBadgeIfNotPresent(Utilisateur user, String name, String desc, String icon) {
        if (user.getBadges().stream().noneMatch(b -> b.getName().equals(name))) {
            Badge badge = badgeRepository.findByName(name)
                    .orElseGet(() -> {
                        Badge b = new Badge();
                        b.setName(name);
                        b.setDescription(desc);
                        b.setIcon(icon);
                        return badgeRepository.save(b);
                    });
            user.getBadges().add(badge);
            utilisateurRepository.save(user);
        }
    }

    public List<UserPoints> getLeaderboard() {
        // Simple implementation: sort by totalPoints descending
        return userPointsRepository.findAll().stream()
                .sorted((a, b) -> Integer.compare(b.getTotalPoints(), a.getTotalPoints()))
                .limit(10)
                .toList();
    }
    
    public UserPoints getUserPoints(Long userId) {
        return userPointsRepository.findByUtilisateurId(userId)
                .orElseGet(() -> {
                    Utilisateur u = utilisateurRepository.findById(userId).orElse(null);
                    if (u == null) return null;
                    UserPoints up = new UserPoints();
                    up.setUtilisateur(u);
                    return userPointsRepository.save(up);
                });
    }
}
