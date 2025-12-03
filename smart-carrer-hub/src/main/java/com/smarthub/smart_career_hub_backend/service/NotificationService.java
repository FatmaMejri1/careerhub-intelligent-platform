package com.smarthub.smart_career_hub_backend.service;

import com.smarthub.smart_career_hub_backend.entity.Administrateur;
import com.smarthub.smart_career_hub_backend.entity.Notification;
import com.smarthub.smart_career_hub_backend.repository.AdministrateurRepository;
import com.smarthub.smart_career_hub_backend.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final AdministrateurRepository administrateurRepository;

    public NotificationService(NotificationRepository notificationRepository,
                               AdministrateurRepository administrateurRepository) {
        this.notificationRepository = notificationRepository;
        this.administrateurRepository = administrateurRepository;
    }

    // =========================
    // Gestion Notification
    // =========================

    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    public Optional<Notification> getNotificationById(Long id) {
        return notificationRepository.findById(id);
    }

    public Notification envoyerNotification(Long adminId, Notification notification) {
        Administrateur admin = administrateurRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Administrateur non trouvé"));
        notification.setAdministrateur(admin);
        return notificationRepository.save(notification);
    }

    public Notification updateNotification(Long id, Notification notificationDetails) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification non trouvée"));

        notification.setMessage(notificationDetails.getMessage());
        notification.setType(notificationDetails.getType());
        return notificationRepository.save(notification);
    }

    public void deleteNotification(Long id) {
        notificationRepository.deleteById(id);
    }

    // =========================
    // Méthodes utiles
    // =========================

    public List<Notification> getNotificationsByAdmin(Long adminId) {
        Administrateur admin = administrateurRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Administrateur non trouvé"));
        return notificationRepository.findByAdministrateurId(adminId);
    }

    public Notification createNotification(Notification notification) {
        return notificationRepository.save(notification);
    }
}
