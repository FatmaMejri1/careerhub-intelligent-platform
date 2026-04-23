package com.smarthub.smart_career_hub_backend.controller;

import com.smarthub.smart_career_hub_backend.entity.Badge;
import com.smarthub.smart_career_hub_backend.entity.ChercheurEmploi;
import com.smarthub.smart_career_hub_backend.entity.UserPoints;
import com.smarthub.smart_career_hub_backend.repository.ChercheurEmploiRepository;
import com.smarthub.smart_career_hub_backend.service.GamificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/gamification")
@RequiredArgsConstructor
public class GamificationController {

    private final GamificationService gamificationService;
    private final ChercheurEmploiRepository chercheurEmploiRepository;

    @GetMapping("/points/{userId}")
    public ResponseEntity<UserPoints> getUserPoints(@PathVariable Long userId) {
        UserPoints up = gamificationService.getUserPoints(userId);
        return up != null ? ResponseEntity.ok(up) : ResponseEntity.notFound().build();
    }

    @GetMapping("/badges/{userId}")
    public ResponseEntity<List<Badge>> getUserBadges(@PathVariable Long userId) {
        UserPoints up = gamificationService.getUserPoints(userId);
        if (up != null && up.getUtilisateur() != null) {
            return ResponseEntity.ok(up.getUtilisateur().getBadges());
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<List<UserPoints>> getLeaderboard() {
        return ResponseEntity.ok(gamificationService.getLeaderboard());
    }

    @GetMapping("/status/{userId}")
    public ResponseEntity<Map<String, Object>> getGamificationStatus(@PathVariable Long userId) {
        UserPoints up = gamificationService.getUserPoints(userId);
        if (up == null) return ResponseEntity.notFound().build();

        Map<String, Object> status = new HashMap<>();
        status.put("points", up.getTotalPoints());
        status.put("level", up.getExperienceLevel());
        status.put("levelName", up.getLevelName());
        status.put("badges", up.getUtilisateur().getBadges());
        
        if (up.getUtilisateur() instanceof ChercheurEmploi) {
            int completion = gamificationService.calculateProfileCompletion((ChercheurEmploi) up.getUtilisateur());
            status.put("profileCompletion", completion);
        }

        return ResponseEntity.ok(status);
    }

    @PostMapping("/add-points/{userId}")
    public ResponseEntity<UserPoints> addPoints(@PathVariable Long userId, @RequestParam int points) {
        return ResponseEntity.ok(gamificationService.addPoints(userId, points));
    }
}
