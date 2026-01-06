package com.smarthub.smart_career_hub_backend.service;

import com.smarthub.smart_career_hub_backend.dto.AdminStatsDTO;
import com.smarthub.smart_career_hub_backend.dto.CandidateStatsDTO;
import com.smarthub.smart_career_hub_backend.dto.OfferStatsDTO;
import com.smarthub.smart_career_hub_backend.dto.RecruiterStatsDTO;
import com.smarthub.smart_career_hub_backend.entity.Candidature;
import com.smarthub.smart_career_hub_backend.entity.ChercheurEmploi;
import com.smarthub.smart_career_hub_backend.entity.Offre;
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
            long appsForOffre = allApps.stream()
                    .filter(a -> a.getOffre().getId().equals(offre.getId()))
                    .count();

            offerStats.add(OfferStatsDTO.builder()
                    .id(offre.getId())
                    .title(offre.getTitre())
                    .views((long) (Math.random() * 500) + 50) // Mock views
                    .applications(appsForOffre)
                    .conversionRate(appsForOffre == 0 ? 0 : (double) appsForOffre / 100) // Mock CR
                    .averageQuality(70 + (Math.random() * 25)) // Mock quality
                    .delayDays((int) (Math.random() * 20) + 5) // Mock delay
                    .build());
        }

        double conversionRate = totalOffers == 0 ? 0 : (double) totalApps / (totalOffers * 100);

        List<OfferStatsDTO> topOffers = offerStats.stream()
                .sorted(Comparator.comparingLong(OfferStatsDTO::getApplications).reversed())
                .limit(5)
                .collect(Collectors.toList());

        List<Map<String, Object>> recentApps = allApps.stream()
                .sorted((a, b) -> b.getId().compareTo(a.getId())) // Assume higher ID = more recent
                .limit(5)
                .map(app -> {
                    Map<String, Object> map = new HashMap<>();
                    String fullName = "Candidat " + app.getChercheurEmploi().getId();
                    if (app.getChercheurEmploi() != null) {
                        fullName = app.getChercheurEmploi().getPrenom() + " " + app.getChercheurEmploi().getNom();
                    }
                    map.put("name", fullName);
                    map.put("initials", fullName.substring(0, 1).toUpperCase());
                    map.put("position", app.getOffre().getTitre());
                    map.put("matchScore", 75 + (int) (Math.random() * 20));
                    map.put("time", "2h"); // Placeholder
                    return map;
                })
                .collect(Collectors.toList());

        return RecruiterStatsDTO.builder()
                .totalOffers(totalOffers)
                .totalApplications(totalApps)
                .averageTimeToHire(18.5) // Placeholder
                .conversionRate(conversionRate * 100)
                .statusDistribution(distribution)
                .topOffers(topOffers)
                .recentApplications(recentApps)
                .offersGrowth(15.0) // Mock growth
                .appsGrowth(8.5) // Mock growth
                .build();
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

        // Simple mock recommendations
        List<Map<String, Object>> recommendedJobs = offreRepository.findAll().stream()
                .limit(3)
                .map(o -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", o.getId());
                    map.put("title", o.getTitre());
                    map.put("company", o.getRecruteur() != null ? o.getRecruteur().getNomEntreprise() : "N/A");
                    map.put("location", o.getLocation());
                    map.put("matchScore", 80 + (int) (Math.random() * 15));
                    return map;
                })
                .collect(Collectors.toList());

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
}
