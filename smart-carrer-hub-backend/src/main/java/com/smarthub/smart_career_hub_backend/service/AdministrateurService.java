package com.smarthub.smart_career_hub_backend.service;

import com.smarthub.smart_career_hub_backend.entity.Administrateur;
import com.smarthub.smart_career_hub_backend.entity.Notification;
import com.smarthub.smart_career_hub_backend.entity.Utilisateur;
import com.smarthub.smart_career_hub_backend.enums.Role;
import com.smarthub.smart_career_hub_backend.repository.AdministrateurRepository;
import com.smarthub.smart_career_hub_backend.repository.NotificationRepository;
import com.smarthub.smart_career_hub_backend.repository.UtilisateurRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AdministrateurService {

    private final AdministrateurRepository administrateurRepository;
    private final NotificationRepository notificationRepository;
    private final UtilisateurRepository utilisateurRepository;

    @PersistenceContext
    private EntityManager entityManager;

    /*
     * =========================
     * CRUD Administrateur
     * =========================
     */

    public Administrateur ajouterAdmin(Administrateur admin) {
        if (administrateurRepository.existsByEmail(admin.getEmail())) {
            throw new IllegalArgumentException("Email déjà utilisé");
        }
        return administrateurRepository.save(admin);
    }

    public List<Administrateur> getAllAdmins() {
        return administrateurRepository.findAll();
    }

    public Administrateur getAdminById(Long id) {
        return administrateurRepository.findById(id).orElseGet(() -> {
            // Find in base Utilisateur table
            Utilisateur u = utilisateurRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'id: " + id));

            // If user has admin role but no Administrateur record yet, create it via native
            // query
            if (u.getRole() == Role.ROLE_ADMIN) {
                try {
                    String firstName = u.getPrenom() != null ? u.getPrenom() : "Admin";
                    String lastName = u.getNom() != null ? u.getNom() : "User";

                    // Force detach to avoid Hibernate cache issues during promotion
                    entityManager.detach(u);

                    entityManager.createNativeQuery(
                            "INSERT INTO administrateurs (id, first_name, last_name, phone, profile_image) VALUES (?, ?, ?, ?, ?)")
                            .setParameter(1, u.getId())
                            .setParameter(2, firstName)
                            .setParameter(3, lastName)
                            .setParameter(4, u.getTelephone())
                            .setParameter(5, null)
                            .executeUpdate();

                    entityManager.flush();
                    entityManager.clear(); // Force Hibernate to forget old parent state

                    // Fetch the newly promoted record
                    return administrateurRepository.findById(id)
                            .orElseThrow(() -> new RuntimeException(
                                    "Le dossier Administrateur a été créé mais n'est pas encore visible. Veuillez rafraîchir la page."));
                } catch (Exception e) {
                    throw new RuntimeException(
                            "Erreur critique lors de la création du dossier Admin: " + e.getMessage());
                }
            }
            throw new RuntimeException("L'utilisateur n'a pas le rôle Administrateur");
        });
    }

    public void deleteAdmin(Long id) {
        if (!administrateurRepository.existsById(id)) {
            throw new RuntimeException("Administrateur inexistant");
        }
        administrateurRepository.deleteById(id);
    }

    /*
     * =========================
     * Profile Admin (HTML)
     * =========================
     */

    public Administrateur updateProfile(Long adminId, Administrateur updatedData) {
        Administrateur admin = getAdminById(adminId);

        if (updatedData.getFirstName() != null) {
            admin.setFirstName(updatedData.getFirstName());
            admin.setPrenom(updatedData.getFirstName()); // Sync with parent
        }
        if (updatedData.getLastName() != null) {
            admin.setLastName(updatedData.getLastName());
            admin.setNom(updatedData.getLastName()); // Sync with parent
        }
        if (updatedData.getPhone() != null) {
            admin.setPhone(updatedData.getPhone());
            admin.setTelephone(updatedData.getPhone()); // Sync with parent
        }
        if (updatedData.getProfileImage() != null)
            admin.setProfileImage(updatedData.getProfileImage());

        return administrateurRepository.save(admin);
    }

    public void updateLastLogin(Long adminId) {
        Administrateur admin = getAdminById(adminId);
        admin.setLastLogin(LocalDateTime.now());
        administrateurRepository.save(admin);
    }

    /*
     * =========================
     * Notifications
     * =========================
     */

    public Notification ajouterNotification(Long adminId, Notification notification) {
        Administrateur admin = getAdminById(adminId);

        notification.setAdministrateur(admin);
        return notificationRepository.save(notification);
    }

    public List<Notification> getNotificationsByAdmin(Long adminId) {
        return notificationRepository.findByAdministrateurId(adminId);
    }
}
