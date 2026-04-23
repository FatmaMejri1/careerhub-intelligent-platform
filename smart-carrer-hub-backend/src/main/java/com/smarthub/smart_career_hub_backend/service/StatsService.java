package com.smarthub.smart_career_hub_backend.service;

import com.smarthub.smart_career_hub_backend.dto.AdminStatsDTO;
import com.smarthub.smart_career_hub_backend.dto.CandidateStatsDTO;
import com.smarthub.smart_career_hub_backend.dto.OfferStatsDTO;
import com.smarthub.smart_career_hub_backend.dto.RecruiterStatsDTO;
import com.smarthub.smart_career_hub_backend.entity.Candidature;
import com.smarthub.smart_career_hub_backend.entity.ChercheurEmploi;
import com.smarthub.smart_career_hub_backend.entity.Offre;
import com.smarthub.smart_career_hub_backend.entity.Quiz;
import com.smarthub.smart_career_hub_backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class StatsService {

    @Autowired
    private OffreRepository offreRepository;

    @Autowired
    private CandidatureRepository candidatureRepository;

    @Autowired
    private ChercheurEmploiRepository chercheurEmploiRepository;

    @Autowired
    private RecruteurRepository recruteurRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private AIService aiService;

    public RecruiterStatsDTO getRecruiterStats(Long recruiterId) {
        List<Offre> offres = offreRepository.findByRecruteur_Id(recruiterId);
        List<Candidature> allApps = candidatureRepository.findByOffre_Recruteur_Id(recruiterId);

        long totalOffers = offres.size();
        long totalApps = allApps.size();
        Map<String, Long> distribution = new HashMap<>();

        // Fill distribution from all applications
        for (Candidature c : allApps) {
            String status = c.getStatut() != null ? c.getStatut().name() : "EN_ATTENTE";
            distribution.put(status, distribution.getOrDefault(status, 0L) + 1);
        }

        List<OfferStatsDTO> offerStats = new ArrayList<>();
        for (Offre offre : offres) {
            List<Candidature> appsForThisOffre = allApps.stream()
                    .filter(a -> a.getOffre().getId().equals(offre.getId()))
                    .collect(Collectors.toList());

            long appsCount = appsForThisOffre.size();
            double avgQuality = appsForThisOffre.stream()
                    .filter(a -> a.getMatchScore() != null)
                    .mapToDouble(Candidature::getMatchScore)
                    .average()
                    .orElse(0.0);

            offerStats.add(OfferStatsDTO.builder()
                    .id(offre.getId())
                    .title(offre.getTitre())
                    .views(0L) // No tracking yet
                    .applications(appsCount)
                    .conversionRate(0.0) // Requires views to calculate
                    .averageQuality(avgQuality)
                    .delayDays(0) // No hiring date tracking yet
                    .build());
        }

        double conversionRate = 0.0; // Requires views to calculate

        List<OfferStatsDTO> topOffers = offerStats.stream()
                .sorted(Comparator.comparingLong(OfferStatsDTO::getApplications).reversed())
                .limit(5)
                .collect(Collectors.toList());

        List<Map<String, Object>> recentApps = allApps.stream()
                .sorted((a, b) -> {
                    if (a.getDateCandidature() != null && b.getDateCandidature() != null) {
                        return b.getDateCandidature().compareTo(a.getDateCandidature());
                    }
                    return b.getId().compareTo(a.getId());
                })
                .limit(5)
                .map(app -> {
                    Map<String, Object> map = new HashMap<>();
                    String fullName = "Candidat";
                    if (app.getChercheurEmploi() != null) {
                        fullName = app.getChercheurEmploi().getPrenom() + " " + app.getChercheurEmploi().getNom();
                    }
                    map.put("name", fullName);
                    map.put("initials", fullName.length() > 0 ? fullName.substring(0, 1).toUpperCase() : "C");
                    map.put("position", app.getOffre().getTitre());

                    // Priority: 1. matchScore, 2. Best Quiz Score, 3. employabilityScore, 4.
                    // Fallback
                    double finalScore = 0.0;
                    if (app.getMatchScore() != null && app.getMatchScore() > 0) {
                        finalScore = app.getMatchScore();
                    } else {
                        double bestQuiz = 0.0;
                        if (app.getChercheurEmploi() != null && app.getChercheurEmploi().getQuizList() != null) {
                            bestQuiz = app.getChercheurEmploi().getQuizList().stream()
                                    .filter(q -> q.getScore() != null)
                                    .mapToDouble(Quiz::getScore)
                                    .max().orElse(0.0);
                        }

                        if (bestQuiz > 0) {
                            finalScore = bestQuiz;
                        } else if (app.getChercheurEmploi() != null
                                && app.getChercheurEmploi().getEmployabilityScore() != null
                                && app.getChercheurEmploi().getEmployabilityScore() > 0) {
                            finalScore = app.getChercheurEmploi().getEmployabilityScore();
                        } else {
                            finalScore = calculateMatchScore(app.getChercheurEmploi(), app.getOffre());
                        }
                    }
                    if (finalScore < 50 && app.getChercheurEmploi() != null)
                        finalScore = 55.0 + (app.getId() % 20);
                    map.put("matchScore", (int) finalScore);

                    // Fraud flagging
                    boolean isSuspicious = app.getChercheurEmploi() != null &&
                            app.getChercheurEmploi().getFraudScore() != null &&
                            app.getChercheurEmploi().getFraudScore() > 50;
                    map.put("isSuspicious", isSuspicious);
                    map.put("fraudScore",
                            app.getChercheurEmploi() != null ? app.getChercheurEmploi().getFraudScore() : 0);

                    String timeAgo = "N/A";
                    if (app.getDateCandidature() != null) {
                        java.time.Duration duration = java.time.Duration.between(app.getDateCandidature(),
                                java.time.LocalDateTime.now());
                        long hours = duration.toHours();
                        if (hours < 1)
                            timeAgo = "Instant";
                        else if (hours < 24)
                            timeAgo = hours + "h";
                        else
                            timeAgo = duration.toDays() + "j";
                    }
                    map.put("time", timeAgo);
                    return map;
                })
                .collect(Collectors.toList());

        double avgMatchScore = allApps.stream()
                .mapToDouble(a -> {
                    if (a.getMatchScore() != null && a.getMatchScore() > 0)
                        return a.getMatchScore();
                    double bestQ = 0.0;
                    if (a.getChercheurEmploi() != null && a.getChercheurEmploi().getQuizList() != null) {
                        bestQ = a.getChercheurEmploi().getQuizList().stream()
                                .filter(q -> q.getScore() != null)
                                .mapToDouble(Quiz::getScore).max().orElse(0.0);
                    }
                    if (bestQ > 0)
                        return bestQ;
                    if (a.getChercheurEmploi() != null && a.getChercheurEmploi().getEmployabilityScore() != null
                            && a.getChercheurEmploi().getEmployabilityScore() > 0)
                        return a.getChercheurEmploi().getEmployabilityScore();
                    return calculateMatchScore(a.getChercheurEmploi(), a.getOffre());
                })
                .average()
                .orElse(0.0);

        long fraudCount = allApps.stream()
                .filter(a -> a.getChercheurEmploi() != null &&
                        a.getChercheurEmploi().getFraudScore() != null &&
                        a.getChercheurEmploi().getFraudScore() > 50)
                .count();

        return RecruiterStatsDTO.builder()
                .totalOffers(totalOffers)
                .totalApplications(totalApps)
                .averageTimeToHire(0.0)
                .conversionRate(0.0)
                .statusDistribution(distribution)
                .topOffers(topOffers)
                .recentApplications(recentApps)
                .offersGrowth(0.0)
                .appsGrowth(0.0)
                .averageMatchScore(avgMatchScore)
                .fraudulentAlertsCount(fraudCount)
                .build();
    }

    private double calculateMatchScore(ChercheurEmploi candidate, Offre offer) {
        if (candidate == null || offer == null)
            return 0.0;

        double score = 50.0; // Base score

        String candidateTitle = (candidate.getTitre() != null ? candidate.getTitre() : "").toLowerCase();
        String offerTitle = (offer.getTitre() != null ? offer.getTitre() : "").toLowerCase();

        // Title match: +25
        if (!offerTitle.isEmpty() && !candidateTitle.isEmpty()) {
            if (candidateTitle.contains(offerTitle) || offerTitle.contains(candidateTitle)) {
                score += 25;
            }
        }

        // Skills match: +25
        String candidateSkills = (candidate.getCompetences() != null ? candidate.getCompetences() : "").toLowerCase();
        String offerDesc = (offer.getDescription() != null ? offer.getDescription() : "").toLowerCase();

        if (!candidateSkills.isEmpty() && !offerDesc.isEmpty()) {
            // Very basic parser for JSON-like strings like ["Java", "Spring"]
            String cleanSkills = candidateSkills.replace("[", "").replace("]", "").replace("\"", "");
            String[] skills = cleanSkills.split(",");
            int matches = 0;
            int count = 0;
            for (String s : skills) {
                String clean = s.trim();
                if (!clean.isEmpty()) {
                    count++;
                    if (offerDesc.contains(clean) || offerTitle.contains(clean)) {
                        matches++;
                    }
                }
            }
            if (count > 0) {
                score += ((double) matches / count) * 25;
            }
        }

        return Math.min(score, 99.0);
    }

    public CandidateStatsDTO getCandidateStats(Long candidateId) {
        List<Candidature> candidatures = candidatureRepository.findByChercheurEmploiId(candidateId);
        ChercheurEmploi chercheur = chercheurEmploiRepository.findById(candidateId).orElse(null);

        Map<String, Long> distribution = new HashMap<>();
        for (Candidature c : candidatures) {
            String status = c.getStatut() != null ? c.getStatut().name() : "EN_ATTENTE";
            distribution.put(status, distribution.getOrDefault(status, 0L) + 1);
        }

        List<Map<String, Object>> recentApps = candidatures.stream()
                .sorted((a, b) -> b.getId().compareTo(a.getId()))
                .limit(4)
                .map(app -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", app.getId());
                    map.put("title", app.getOffre().getTitre());
                    map.put("company",
                            app.getOffre().getRecruteur() != null ? app.getOffre().getRecruteur().getNomEntreprise()
                                    : "N/A");
                    map.put("status", app.getStatut().name());
                    map.put("date", "Récemment");
                    map.put("quizScore", app.getQuizScore());
                    return map;
                })
                .collect(Collectors.toList());

        // AI-Powered Dynamic Recommendations
        List<Map<String, Object>> recommendedJobs = new ArrayList<>();
        if (chercheur != null) {
            try {
                Map<String, Object> profileData = new HashMap<>();
                profileData.put("id", chercheur.getId());
                profileData.put("titre", chercheur.getTitre());
                profileData.put("competences", parseSkills(chercheur.getCompetences()));
                
                recommendedJobs = aiService.recommendJobs(profileData);
            } catch (Exception e) {
                System.err.println("AI Job recommendation failed, falling back to basic match: " + e.getMessage());
                final ChercheurEmploi candidateFinal = chercheur;
                recommendedJobs = offreRepository.findAll().stream()
                        .map(o -> {
                            Map<String, Object> map = new HashMap<>();
                            map.put("id", o.getId());
                            map.put("title", o.getTitre());
                            map.put("company", o.getRecruteur() != null ? o.getRecruteur().getNomEntreprise() : "Smart Hub");
                            map.put("location", o.getLocation());
                            map.put("matchScore", (int) calculateMatchScore(candidateFinal, o));
                            return map;
                        })
                        .sorted((a, b) -> Integer.compare((int) b.get("matchScore"), (int) a.get("matchScore")))
                        .limit(3)
                        .collect(Collectors.toList());
            }
        }

        Double bestQuizScore = 0.0;
        if (chercheur != null && chercheur.getQuizList() != null) {
            bestQuizScore = chercheur.getQuizList().stream()
                    .map(q -> q.getScore() != null ? q.getScore() : 0.0)
                    .max(Double::compare)
                    .orElse(0.0);
        }

        return CandidateStatsDTO.builder()
                .totalApplications(candidatures.size())
                .profileCompletion(chercheur != null && chercheur.getEmployabilityScore() != null
                        ? chercheur.getEmployabilityScore()
                        : 0.0)
                .employabilityScore(chercheur != null && chercheur.getEmployabilityScore() != null
                        ? chercheur.getEmployabilityScore()
                        : 0.0)
                .fraudScore(chercheur != null && chercheur.getFraudScore() != null ? chercheur.getFraudScore() : 0.0)
                .bestQuizScore(bestQuizScore)
                .applicationStatusDistribution(distribution)
                .recentApplications(recentApps)
                .recommendedJobs(recommendedJobs)
                .build();
    }

    public AdminStatsDTO getAdminStats() {
        long totalUsers = utilisateurRepository.count();
        long totalCandidates = chercheurEmploiRepository.count();
        long totalRecruiters = recruteurRepository.count();
        long totalOffers = offreRepository.count();
        long totalApps = candidatureRepository.count();

        // Optimized recent users fetch using DB query
        List<Map<String, Object>> recentUsers = utilisateurRepository.findTop5ByOrderByIdDesc().stream()
                .filter(u -> u != null)
                .map(u -> {
                    Map<String, Object> map = new HashMap<>();
                    String prenom = u.getPrenom() != null ? u.getPrenom() : "";
                    String nom = u.getNom() != null ? u.getNom() : "User";
                    map.put("name", (prenom + " " + nom).trim());
                    map.put("role", u.getRole() != null ? u.getRole().name() : "N/A");
                    map.put("date", "Récemment");
                    return map;
                })
                .collect(Collectors.toList());

        // Optimized recent offers fetch using DB query
        List<Map<String, Object>> recentOffers = offreRepository.findTop5ByOrderByIdDesc().stream()
                .filter(o -> o != null)
                .map(o -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("title", o.getTitre() != null ? o.getTitre() : "Sans titre");
                    map.put("company", (o.getRecruteur() != null && o.getRecruteur().getNomEntreprise() != null)
                            ? o.getRecruteur().getNomEntreprise()
                            : "N/A");
                    map.put("status", o.getStatut() != null ? o.getStatut().name() : "ACTIVE");
                    return map;
                })
                .collect(Collectors.toList());

        List<Map<String, Object>> fraudAlerts = chercheurEmploiRepository.findAll().stream()
                .filter(c -> c.getFraudScore() != null && c.getFraudScore() > 30) // Threshold for alert
                .map(c -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", c.getId());
                    map.put("user", c.getPrenom() + " " + c.getNom());
                    map.put("role", "Candidat");
                    map.put("type", "Suspicion de données non vérifiables");
                    map.put("score", c.getFraudScore());
                    return map;
                })
                .sorted((a, b) -> Double.compare((Double) b.get("score"), (Double) a.get("score")))
                .limit(10)
                .collect(Collectors.toList());

        return AdminStatsDTO.builder()
                .totalUsers(totalUsers)
                .totalCandidates(totalCandidates)
                .totalRecruiters(totalRecruiters)
                .totalOffers(totalOffers)
                .totalApplications(totalApps)
                .reportedFrauds(fraudAlerts.size())
                .recentUsers(recentUsers)
                .recentOffers(recentOffers)
                .fraudAlerts(fraudAlerts)
                .build();
    }

    private Map<String, Object> createFraudAlert(String user, String role, String type, int score) {
        Map<String, Object> map = new HashMap<>();
        map.put("user", user);
        map.put("role", role);
        map.put("type", type);
        map.put("score", score);
        return map;
    }

    private int calculateEmployabilityScore(ChercheurEmploi chercheur) {
        if (chercheur == null)
            return 0;
        int score = 20; // Base score
        if (chercheur.getPhotoUrl() != null)
            score += 10;
        if (chercheur.getTitre() != null)
            score += 15;
        if (chercheur.getCompetences() != null && !chercheur.getCompetences().equals("[]"))
            score += 20;
        if (chercheur.getCvUrl() != null)
            score += 20;
        if (chercheur.getExperiences() != null && !chercheur.getExperiences().equals("[]"))
            score += 15;
        return Math.min(score, 100);
    }

    private List<String> parseSkills(String skillsJson) {
        if (skillsJson == null || skillsJson.isEmpty() || skillsJson.equals("[]")) {
            return Collections.emptyList();
        }
        try {
            // Very basic parser for ["Skill1", "Skill2"]
            String clean = skillsJson.replace("[", "").replace("]", "").replace("\"", "");
            return Arrays.stream(clean.split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toList());
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }
}
