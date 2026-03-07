package com.smarthub.smart_career_hub_backend.service;

import com.smarthub.smart_career_hub_backend.entity.ChercheurEmploi;
import com.smarthub.smart_career_hub_backend.entity.Recruteur;
import com.smarthub.smart_career_hub_backend.entity.Utilisateur;
import com.smarthub.smart_career_hub_backend.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

import com.smarthub.smart_career_hub_backend.dto.UserAdminDTO;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class UtilisateurService {

    private final UtilisateurRepository utilisateurRepository;

    @Transactional(readOnly = true)
    public List<UserAdminDTO> getAllUsersAdmin() {
        return utilisateurRepository.findAll().stream().map(u -> {
            UserAdminDTO.UserAdminDTOBuilder builder = UserAdminDTO.builder()
                    .id(u.getId())
                    .name((u.getPrenom() != null ? u.getPrenom() : "") + " " + (u.getNom() != null ? u.getNom() : ""))
                    .email(u.getEmail())
                    .role(u.getRole() != null ? u.getRole().name() : "N/A")
                    .status(u.getStatut())
                    .photoUrl(u.getPhotoUrl())
                    .joinDate(u.getDateCreation())
                    .lastActivity(LocalDateTime.now());

            if (u instanceof ChercheurEmploi) {
                ChercheurEmploi c = (ChercheurEmploi) u;
                Double fScore = c.getFraudScore() != null ? c.getFraudScore() : 0.0;
                builder.fraudScore(fScore);
                builder.reliabilityScore(100 - fScore);
                builder.activityCount((long) (c.getQuizList() != null ? c.getQuizList().size() : 0));
            } else if (u instanceof Recruteur) {
                Recruteur r = (Recruteur) u;
                builder.reliabilityScore(95.0);
                builder.activityCount((long) (r.getOffres() != null ? r.getOffres().size() : 0));
            } else {
                builder.reliabilityScore(100.0);
                builder.activityCount(0L);
            }

            return builder.build();
        }).collect(Collectors.toList());
    }

    public List<Utilisateur> getAllUtilisateurs() {
        return utilisateurRepository.findAll();
    }

    public Optional<Utilisateur> getUtilisateurById(Long id) {
        return utilisateurRepository.findById(id);
    }

    public Utilisateur ajouterUtilisateur(Utilisateur utilisateur) {
        return utilisateurRepository.save(utilisateur);
    }

    public void deleteUtilisateur(Long id) {
        utilisateurRepository.deleteById(id);
    }

    public Utilisateur createUtilisateur(Utilisateur utilisateur) {
        return utilisateurRepository.save(utilisateur);
    }

    public Utilisateur updateUtilisateur(Long id, Utilisateur utilisateurDetails) {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        utilisateur.setNom(utilisateurDetails.getNom());
        utilisateur.setPrenom(utilisateurDetails.getPrenom());
        utilisateur.setEmail(utilisateurDetails.getEmail());
        utilisateur.setMotDePasse(utilisateurDetails.getMotDePasse());
        utilisateur.setRole(utilisateurDetails.getRole());

        return utilisateurRepository.save(utilisateur);
    }

    public void updatePassword(Long id, String currentPassword, String newPassword) {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        if (!utilisateur.getMotDePasse().equals(currentPassword)) {
            throw new RuntimeException("L'ancien mot de passe est incorrect.");
        }

        utilisateur.setMotDePasse(newPassword);
        utilisateurRepository.save(utilisateur);
    }
}
