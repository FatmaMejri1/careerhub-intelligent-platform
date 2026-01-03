package com.smarthub.smart_career_hub_backend.service;

import com.smarthub.smart_career_hub_backend.entity.Offre;
import com.smarthub.smart_career_hub_backend.entity.Recruteur;
import com.smarthub.smart_career_hub_backend.repository.RecruteurRepository;
import com.smarthub.smart_career_hub_backend.repository.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.List;
import java.util.Optional;

@Service
public class RecruteurService {

    @Autowired
    private RecruteurRepository recruteurRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @PersistenceContext
    private EntityManager entityManager;

    // =========================
    // Standard CRUD Operations
    // =========================

    public List<Recruteur> getAllRecruteurs() {
        return recruteurRepository.findAll();
    }

    public Optional<Recruteur> getRecruteurById(Long id) {
        return recruteurRepository.findById(id);
    }

    public Recruteur createRecruteur(Recruteur recruteur) {
        // Normal save if new recruiter
        return recruteurRepository.save(recruteur);
    }

    public Recruteur updateRecruteur(Long id, Recruteur recruteurDetails) {
        Recruteur recruteur = recruteurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recruteur non trouvé"));

        // Update basic fields
        if (recruteurDetails.getNom() != null)
            recruteur.setNom(recruteurDetails.getNom());
        if (recruteurDetails.getPrenom() != null)
            recruteur.setPrenom(recruteurDetails.getPrenom());
        if (recruteurDetails.getEmail() != null)
            recruteur.setEmail(recruteurDetails.getEmail());
        if (recruteurDetails.getTelephone() != null)
            recruteur.setTelephone(recruteurDetails.getTelephone());

        // Update recruiter-specific fields
        if (recruteurDetails.getNomEntreprise() != null)
            recruteur.setNomEntreprise(recruteurDetails.getNomEntreprise());
        if (recruteurDetails.getSiteWeb() != null)
            recruteur.setSiteWeb(recruteurDetails.getSiteWeb());
        if (recruteurDetails.getDescriptionEntreprise() != null)
            recruteur.setDescriptionEntreprise(recruteurDetails.getDescriptionEntreprise());
        if (recruteurDetails.getAdresseEntreprise() != null)
            recruteur.setAdresseEntreprise(recruteurDetails.getAdresseEntreprise());
        if (recruteurDetails.getPoste() != null)
            recruteur.setPoste(recruteurDetails.getPoste());
        if (recruteurDetails.getLinkedin() != null)
            recruteur.setLinkedin(recruteurDetails.getLinkedin());
        if (recruteurDetails.getTwitter() != null)
            recruteur.setTwitter(recruteurDetails.getTwitter());
        if (recruteurDetails.getSpecialities() != null)
            recruteur.setSpecialities(recruteurDetails.getSpecialities());

        // Sync both image fields
        if (recruteurDetails.getProfileImage() != null) {
            recruteur.setProfileImage(recruteurDetails.getProfileImage());
            recruteur.setPhotoUrl(recruteurDetails.getProfileImage());
        } else if (recruteurDetails.getPhotoUrl() != null) {
            recruteur.setPhotoUrl(recruteurDetails.getPhotoUrl());
            recruteur.setProfileImage(recruteurDetails.getPhotoUrl());
        }

        return recruteurRepository.save(recruteur);
    }

    public void deleteRecruteur(Long id) {
        recruteurRepository.deleteById(id);
    }

    public void updateProfileImage(Long id, String base64Image) {
        Recruteur recruteur = recruteurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recruteur non trouvé"));
        recruteur.setProfileImage(base64Image);
        recruteur.setPhotoUrl(base64Image);
        recruteurRepository.save(recruteur);
    }

    @Transactional
    public Recruteur promoteUserToRecruiter(Long userId, Recruteur recruteurData) {
        System.out.println("Promoting User ID " + userId + " to Recruiter");

        // Check if row exists in recruteurs table using native SQL to avoid Hibernate
        // inheritance issues
        Number count = (Number) entityManager.createNativeQuery("SELECT COUNT(*) FROM recruteurs WHERE id = :id")
                .setParameter("id", userId)
                .getSingleResult();
        boolean isRecruiter = count.intValue() > 0;

        boolean isUser = utilisateurRepository.existsById(userId);

        if (!isUser) {
            throw new RuntimeException("User not found with ID: " + userId);
        }

        if (isRecruiter) {
            // Already a recruiter, just update
            return updateRecruteur(userId, recruteurData);
        }

        // Perform Native Promotion
        try {
            // 1. Update basic info in utilisateurs table
            // In JOINED strategy, there is no dtype column by default.
            // We update the role so the application logic knows it's a recruiter.
            // We also sync photo_url here.
            String sqlUpdateUser = "UPDATE utilisateurs SET nom = :nom, prenom = :prenom, telephone = :phone, role = 'RECRUTEUR', photo_url = :photo WHERE id = :id";
            entityManager.createNativeQuery(sqlUpdateUser)
                    .setParameter("id", userId)
                    .setParameter("nom", recruteurData.getNom())
                    .setParameter("prenom", recruteurData.getPrenom())
                    .setParameter("phone", recruteurData.getTelephone())
                    .setParameter("photo", recruteurData.getPhotoUrl())
                    .executeUpdate();

            // 2. Insert into recruteurs table
            // Hibernate expects a row here for any entity of type Recruteur
            String sqlInsert = "INSERT INTO recruteurs (id, nom_entreprise, site_web, description_entreprise, adresse_entreprise, poste, linkedin, twitter, profile_image) "
                    +
                    "VALUES (:id, :company, :web, :desc, :addr, :role, :linkedin, :twitter, :profileImage)";

            entityManager.createNativeQuery(sqlInsert)
                    .setParameter("id", userId)
                    .setParameter("company", recruteurData.getNomEntreprise())
                    .setParameter("web", recruteurData.getSiteWeb())
                    .setParameter("desc", recruteurData.getDescriptionEntreprise())
                    .setParameter("addr", recruteurData.getAdresseEntreprise())
                    .setParameter("role", recruteurData.getPoste())
                    .setParameter("linkedin", recruteurData.getLinkedin())
                    .setParameter("twitter", recruteurData.getTwitter())
                    .setParameter("profileImage", recruteurData.getProfileImage())
                    .executeUpdate();

            entityManager.flush();
            entityManager.clear();

            // Return the newly promoted recruiter
            return recruteurRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Promotion failed: Recruiter not found after promote."));

        } catch (Exception e) {
            System.err.println("Promotion Exception: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to promote user: " + e.getMessage());
        }
    }
}
