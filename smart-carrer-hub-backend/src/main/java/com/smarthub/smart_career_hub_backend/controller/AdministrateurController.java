package com.smarthub.smart_career_hub_backend.controller;

import com.smarthub.smart_career_hub_backend.entity.Administrateur;
import com.smarthub.smart_career_hub_backend.entity.Notification;
import com.smarthub.smart_career_hub_backend.service.AdministrateurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
public class AdministrateurController {

    @Autowired // dependency injection pour injecter l'instance de la classe AdministrateurService dans le controller
    private AdministrateurService administrateurService;

    @GetMapping // pour récupérer toutes les administrateurs
    public List<Administrateur> getAll() {
        return administrateurService.getAllAdmins();
    }

    @GetMapping("/{id}") // pour récupérer un administrateur par ID
    public ResponseEntity<Administrateur> getById(@PathVariable Long id) //
    // pathvariable pour récupérer l'ID de l'administrateur dans l'URL
    {
        Optional<Administrateur> admin = administrateurService.getAdminById(id);
        return admin.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping // pour créer un administrateur
    public ResponseEntity<Administrateur> create(@RequestBody Administrateur admin) 
    // requestbody pour récupérer le corps de la requête en JSON
    {
        try {
            Administrateur savedAdmin = administrateurService.ajouterAdmin(admin);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedAdmin);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Administrateur> update(@PathVariable Long id, @RequestBody Administrateur admin) {
        try {
            // Pour l'instant, simple sauvegarde - à améliorer avec update spécifique
            admin.setId(id);
            Administrateur updatedAdmin = administrateurService.ajouterAdmin(admin);
            return ResponseEntity.ok(updatedAdmin);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            administrateurService.deleteAdmin(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Endpoints spécifiques pour les notifications
    @PostMapping("/{adminId}/notifications")
    public ResponseEntity<Notification> ajouterNotification(
            @PathVariable Long adminId,
            @RequestBody Notification notification) {
        try {
            Notification savedNotification = administrateurService.ajouterNotification(adminId, notification);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedNotification);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{adminId}/notifications")
    public ResponseEntity<List<Notification>> getNotificationsByAdmin(@PathVariable Long adminId) {
        try {
            List<Notification> notifications = administrateurService.getNotificationsByAdmin(adminId);
            return ResponseEntity.ok(notifications);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}