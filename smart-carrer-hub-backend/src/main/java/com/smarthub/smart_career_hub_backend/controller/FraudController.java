package com.smarthub.smart_career_hub_backend.controller;

import com.smarthub.smart_career_hub_backend.service.ChercheurEmploiService;
import com.smarthub.smart_career_hub_backend.service.StatsService;
import com.smarthub.smart_career_hub_backend.service.UtilisateurService;
import com.smarthub.smart_career_hub_backend.service.AIService;
import lombok.RequiredArgsConstructor;
import com.smarthub.smart_career_hub_backend.entity.ChercheurEmploi;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/fraud")
@RequiredArgsConstructor
public class FraudController {

    private final StatsService statsService;
    private final UtilisateurService utilisateurService;
    private final ChercheurEmploiService chercheurEmploiService;
    private final AIService aiService;

    @GetMapping("/alerts")
    public ResponseEntity<List<Map<String, Object>>> getFraudAlerts() {
        return ResponseEntity.ok(statsService.getAdminStats().getFraudAlerts());
    }

    @GetMapping("/ai-analysis/{userId}")
    public ResponseEntity<?> getAIAnalysis(@PathVariable Long userId) {
        try {
            Optional<ChercheurEmploi> optionalChercheur = chercheurEmploiService.getChercheurById(userId);
            if (optionalChercheur.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            ChercheurEmploi c = optionalChercheur.get();

            Map<String, Object> aiRequest = new HashMap<>();
            aiRequest.put("user_id", c.getId());
            aiRequest.put("full_name", c.getPrenom() + " " + c.getNom());

            List<String> links = new ArrayList<>();
            if (c.getLinkedin() != null)
                links.add(c.getLinkedin());
            if (c.getGithub() != null)
                links.add(c.getGithub());
            if (c.getPortfolio() != null)
                links.add(c.getPortfolio());
            aiRequest.put("social_links", links);

            aiRequest.put("experiences", parseJson(c.getExperiences()));
            aiRequest.put("education", parseJson(c.getEducations()));

            Map<String, Object> analysis = aiService.analyzeFraud(aiRequest);

            if (analysis != null && analysis.containsKey("fraud_score")) {
                c.setFraudScore(((Number) analysis.get("fraud_score")).doubleValue());
                chercheurEmploiService.ajouterChercheur(c);
            }

            return ResponseEntity.ok(analysis);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "AI Analysis Error: " + e.getMessage()));
        }
    }

    private List<?> parseJson(String json) {
        if (json == null || json.isEmpty() || json.equals("[]"))
            return new ArrayList<>();
        try {
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            return mapper.readValue(json, List.class);
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    @GetMapping("/report/{userId}")
    public ResponseEntity<?> getFraudReport(@PathVariable Long userId) {
        try {
            Optional<ChercheurEmploi> optionalChercheur = chercheurEmploiService.getChercheurById(userId);
            if (optionalChercheur.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            ChercheurEmploi c = optionalChercheur.get();

            Map<String, Object> aiRequest = new HashMap<>();
            aiRequest.put("user_id", c.getId());
            aiRequest.put("full_name", c.getPrenom() + " " + c.getNom());

            List<String> links = new ArrayList<>();
            if (c.getLinkedin() != null)
                links.add(c.getLinkedin());
            if (c.getGithub() != null)
                links.add(c.getGithub());
            if (c.getPortfolio() != null)
                links.add(c.getPortfolio());
            aiRequest.put("social_links", links);
            aiRequest.put("experiences", parseJson(c.getExperiences()));
            aiRequest.put("education", parseJson(c.getEducations()));

            Map<String, Object> analysis = aiService.analyzeFraud(aiRequest);

            if (analysis == null) {
                return ResponseEntity.status(500).body(Map.of("error", "Failed to generate analysis for report"));
            }

            int finalScore = ((Number) analysis.getOrDefault("fraud_score", 0)).intValue();
            int simpleScore = ((Number) analysis.getOrDefault("heuristic_score", 0)).intValue();
            int aiScore = ((Number) analysis.getOrDefault("ai_fraud_score", 0)).intValue();
            int reliability = 100 - finalScore;

            StringBuilder report = new StringBuilder();
            report.append("====================================================\n");
            report.append("   RAPPORT D'ANALYSE D'INTÉGRITÉ & FIABILITÉ\n");
            report.append("====================================================\n\n");

            report.append("IDENTITÉ DU CANDIDAT :\n");
            report.append("Nom Complet : ").append(c.getPrenom()).append(" ").append(c.getNom()).append("\n");
            report.append("ID Système  : ").append(c.getId()).append("\n");
            report.append("Rôle        : ").append(c.getRole()).append("\n\n");

            report.append("------- SCORES DE CONFIANCE -------\n");
            report.append("INDICE DE FIABILITÉ : ").append(reliability).append("%\n");
            report.append("RISQUE DE FRAUDE    : ").append(finalScore).append("%\n");
            report.append("----------------------------------\n\n");

            report.append("DÉTAIL DU CALCUL :\n");
            report.append("- Calcul Simple (Heuristique) : ").append(simpleScore).append("%\n");
            report.append("- Analyse Prédictive (IA)    : ").append(aiScore).append("%\n\n");

            report.append("RÉSUMÉ DU STATUT :\n");
            report.append("Décision IA : ")
                    .append(((Boolean) analysis.getOrDefault("is_suspicious", false) ? "⚠️ SUSPECT" : "✅ AUTHENTIQUE"))
                    .append("\n\n");

            report.append("ANALYSE DÉTAILLÉE DE L'IA :\n");
            report.append(analysis.getOrDefault("ai_analysis", "Pas d'analyse textuelle disponible")).append("\n\n");

            report.append("FAISCEAU DE PREUVES DÉTECTÉES :\n");
            Object evidenceRaw = analysis.get("evidence");
            if (evidenceRaw instanceof List) {
                List<?> evidenceList = (List<?>) evidenceRaw;
                if (!evidenceList.isEmpty()) {
                    for (Object obj : evidenceList) {
                        if (obj instanceof Map) {
                            @SuppressWarnings("unchecked")
                            Map<String, Object> e = (Map<String, Object>) obj;
                            report.append("- [").append(e.get("severity")).append("] ")
                                    .append(e.get("label")).append(" : ").append(e.get("value")).append("\n");
                        }
                    }
                } else {
                    report.append("Aucun point de vigilance spécifique n'a été détecté.\n");
                }
            }

            report.append("\n\nGénéré dynamiquement par Smart Career AI Engine\n");
            report.append("Date du rapport : ").append(java.time.LocalDateTime.now()).append("\n");
            report.append("====================================================\n");

            byte[] reportBytes = report.toString().getBytes(java.nio.charset.StandardCharsets.UTF_8);

            return ResponseEntity.ok()
                    .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=report_fiabilite_" + userId + ".txt")
                    .contentType(org.springframework.http.MediaType.TEXT_PLAIN)
                    .contentLength((long) reportBytes.length)
                    .body(reportBytes);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Report Generation Error: " + e.getMessage()));
        }
    }

    @PostMapping("/resolve/{userId}")
    public ResponseEntity<?> resolveAlert(
            @PathVariable Long userId,
            @RequestParam("action") String action) {
        try {
            String message;
            if ("Bloquer".equalsIgnoreCase(action)) {
                utilisateurService.getUtilisateurById(userId).ifPresent(u -> {
                    u.setStatut("Suspendu");
                    utilisateurService.ajouterUtilisateur(u);
                });
                message = "Utilisateur bloqué avec succès";
            } else {
                message = "Alerte ignorée";
            }
            return ResponseEntity.ok(Map.of("message", message));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Error resolving alert: " + e.getMessage()));
        }
    }
}
