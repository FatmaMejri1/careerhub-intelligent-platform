package com.smarthub.smart_career_hub_backend.service;

import com.smarthub.smart_career_hub_backend.entity.Administrateur;
import com.smarthub.smart_career_hub_backend.entity.Notification;
import com.smarthub.smart_career_hub_backend.repository.AdministrateurRepository;
import com.smarthub.smart_career_hub_backend.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.util.List; //pour les méthodes
import java.util.Optional; //pour les méthodes

@Service
public class AdministrateurService {

    private final AdministrateurRepository administrateurRepository;
    private final NotificationRepository notificationRepository;

    public AdministrateurService(AdministrateurRepository administrateurRepository,
                                 NotificationRepository notificationRepository) {
        this.administrateurRepository = administrateurRepository;
        this.notificationRepository = notificationRepository;
    }

    public Administrateur ajouterAdmin(Administrateur admin) {
        return administrateurRepository.save(admin);
    }

    public List<Administrateur> getAllAdmins() {
        return administrateurRepository.findAll();
    }

    public Optional<Administrateur> getAdminById(Long id) {
        return administrateurRepository.findById(id);
    }

    public void deleteAdmin(Long id) {
        administrateurRepository.deleteById(id);
    }

    // ADD NOTIFICATION TO ADMIN
    public Notification ajouterNotification(Long adminId, Notification notification) {
        Administrateur admin = administrateurRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Administrateur non trouvé"));

        notification.setAdministrateur(admin); // now works
        return notificationRepository.save(notification);
    }

    // GET LIST OF ADMIN NOTIFICATIONS
    public List<Notification> getNotificationsByAdmin(Long adminId) {
        return notificationRepository.findByAdministrateurId(adminId);
    }
}
