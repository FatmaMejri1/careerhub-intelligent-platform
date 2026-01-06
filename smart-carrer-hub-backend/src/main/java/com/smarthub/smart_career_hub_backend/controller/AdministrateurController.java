package com.smarthub.smart_career_hub_backend.controller;

import com.smarthub.smart_career_hub_backend.entity.Administrateur;
import com.smarthub.smart_career_hub_backend.entity.Notification;
import com.smarthub.smart_career_hub_backend.service.AdministrateurService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdministrateurController {

    private final AdministrateurService administrateurService;

    /*
     * =========================
     * CRUD Administrateur
     * =========================
     */

    @GetMapping
    public ResponseEntity<List<Administrateur>> getAllAdmins() {
        return ResponseEntity.ok(administrateurService.getAllAdmins());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAdminById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(administrateurService.getAdminById(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching admin: " + e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<Administrateur> createAdmin(@RequestBody Administrateur admin) {
        Administrateur savedAdmin = administrateurService.ajouterAdmin(admin);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedAdmin);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAdmin(@PathVariable Long id) {
        administrateurService.deleteAdmin(id);
        return ResponseEntity.noContent().build();
    }

    /*
     * =========================
     * Profile Admin (HTML)
     * =========================
     */

    @PutMapping("/{id}/profile")
    public ResponseEntity<?> updateProfile(
            @PathVariable Long id,
            @RequestBody Administrateur admin) {
        try {
            Administrateur updatedAdmin = administrateurService.updateProfile(id, admin);
            return ResponseEntity.ok(updatedAdmin);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating profile: " + e.getMessage());
        }
    }

    @PostMapping(value = "/{id}/photo", consumes = "multipart/form-data")
    public ResponseEntity<?> uploadPhoto(@PathVariable Long id,
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        try {
            String url = administrateurService.uploadPhoto(id, file);
            java.util.Map<String, String> response = new java.util.HashMap<>();
            response.put("url", url);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error uploading photo: " + e.getMessage());
        }
    }

    /*
     * =========================
     * Notifications
     * =========================
     */

    @PostMapping("/{adminId}/notifications")
    public ResponseEntity<Notification> ajouterNotification(
            @PathVariable Long adminId,
            @RequestBody Notification notification) {

        Notification savedNotification = administrateurService.ajouterNotification(adminId, notification);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedNotification);
    }

    @GetMapping("/{adminId}/notifications")
    public ResponseEntity<List<Notification>> getNotificationsByAdmin(
            @PathVariable Long adminId) {

        return ResponseEntity.ok(
                administrateurService.getNotificationsByAdmin(adminId));
    }
}
