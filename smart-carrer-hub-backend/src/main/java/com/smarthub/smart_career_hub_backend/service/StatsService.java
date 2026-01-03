package com.smarthub.smart_career_hub_backend.service;

import com.smarthub.smart_career_hub_backend.dto.OfferStatsDTO;
import com.smarthub.smart_career_hub_backend.dto.RecruiterStatsDTO;
import com.smarthub.smart_career_hub_backend.entity.Candidature;
import com.smarthub.smart_career_hub_backend.entity.Offre;
import com.smarthub.smart_career_hub_backend.repository.CandidatureRepository;
import com.smarthub.smart_career_hub_backend.repository.OffreRepository;
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
}
