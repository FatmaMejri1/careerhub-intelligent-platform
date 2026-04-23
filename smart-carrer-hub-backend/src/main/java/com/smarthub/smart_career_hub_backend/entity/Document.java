package com.smarthub.smart_career_hub_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "documents")
public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String type; // 'cv' or 'coverLetter'
    private String fileType; // 'pdf', 'docx', etc.
    
    @Column(columnDefinition = "TEXT")
    private String fileUrl; // Base64 or URL
    
    private Long fileSize; // in bytes
    private boolean isDefault;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @ManyToOne
    @JoinColumn(name = "chercheur_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private ChercheurEmploi chercheur;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}


