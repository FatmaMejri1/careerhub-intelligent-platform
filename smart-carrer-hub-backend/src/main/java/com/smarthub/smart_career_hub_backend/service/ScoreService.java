package com.smarthub.smart_career_hub_backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smarthub.smart_career_hub_backend.entity.ChercheurEmploi;
import com.smarthub.smart_career_hub_backend.entity.Quiz;
import com.smarthub.smart_career_hub_backend.repository.ChercheurEmploiRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class ScoreService {

    private final ChercheurEmploiRepository chercheurRepository;
    private final ObjectMapper objectMapper;

    /**
     * Updates Employability and Fraud scores for a candidate
     */
    public void updateScores(ChercheurEmploi candidate) {
        if (candidate == null) return;

        double employability = calculateEmployability(candidate);
        double fraud = calculateFraudScore(candidate);

        candidate.setEmployabilityScore(employability);
        candidate.setFraudScore(fraud);

        chercheurRepository.save(candidate);
    }

    private double calculateEmployability(ChercheurEmploi c) {
        double score = 0;

        // 1. Profile Completeness (Max 50)
        if (c.getPrenom() != null) score += 5;
        if (c.getTitre() != null) score += 5;
        if (c.getObjectif() != null) score += 5;
        if (c.getPhotoUrl() != null) score += 5;
        if (parseList(c.getCompetences()).size() > 0) score += 10;
        if (parseList(c.getExperiences()).size() > 0) score += 10;
        if (parseList(c.getEducations()).size() > 0) score += 10;

        // 2. Best Quiz Score (Max 50)
        double maxQuiz = 0;
        if (c.getQuizList() != null) {
            for (Quiz q : c.getQuizList()) {
                if (q.getScore() != null && q.getScore() > maxQuiz) {
                    maxQuiz = q.getScore();
                }
            }
        }
        // Normalize quiz score (assuming quiz is out of 100) -> cap at 50 points
        score += (maxQuiz * 0.5);

        return Math.min(score, 100.0);
    }

    private double calculateFraudScore(ChercheurEmploi c) {
        double fraudPoints = 0;
        List<Map<String, Object>> certs = parseListMaps(c.getCertifications());
        List<Map<String, Object>> exps = parseListMaps(c.getExperiences());
        List<Map<String, Object>> edus = parseListMaps(c.getEducations());

        // 1. Check Certifications Links
        for (Map<String, Object> cert : certs) {
            String link = (String) cert.get("link");
            String title = (String) cert.get("title");
            
            // If it claims to be a certification but has no link or invalid link -> Suspicious
            if (link == null || link.isEmpty() || !isValidUrl(link)) {
                fraudPoints += 20; 
            }
        }

        // 2. Check Education/Experience for known universities/companies checks (Heuristic)
        // Simple heuristic: if company name is very short or contains "test", "fake", etc.
        for (Map<String, Object> exp : exps) {
            String company = (String) exp.get("company");
            if (company != null && (company.length() < 2 || company.toLowerCase().contains("test"))) {
                fraudPoints += 10;
            }
        }
        
        for (Map<String, Object> edu : edus) {
            String school = (String) edu.get("school");
            if (school != null && (school.length() < 2 || school.toLowerCase().contains("test"))) {
                fraudPoints += 10;
            }
        }

        return Math.min(fraudPoints, 100.0);
    }

    private boolean isValidUrl(String url) {
        if (url == null) return false;
        String regex = "^(http|https)://.*$";
        Pattern p = Pattern.compile(regex);
        Matcher m = p.matcher(url);
        return m.matches();
    }

    private List<String> parseList(String json) {
        try {
            if (json == null || json.isEmpty()) return new ArrayList<>();
            return objectMapper.readValue(json, List.class);
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }
    
    private List<Map<String, Object>> parseListMaps(String json) {
        try {
            if (json == null || json.isEmpty()) return new ArrayList<>();
            return objectMapper.readValue(json, List.class);
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }
}
