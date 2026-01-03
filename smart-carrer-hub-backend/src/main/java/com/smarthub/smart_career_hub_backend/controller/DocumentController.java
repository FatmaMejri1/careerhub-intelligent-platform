package com.smarthub.smart_career_hub_backend.controller;

import com.smarthub.smart_career_hub_backend.entity.Document;
import com.smarthub.smart_career_hub_backend.entity.ChercheurEmploi;
import com.smarthub.smart_career_hub_backend.service.DocumentService;
import com.smarthub.smart_career_hub_backend.service.ChercheurEmploiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentService documentService;
    private final ChercheurEmploiService chercheurEmploiService;

    public DocumentController(DocumentService documentService, ChercheurEmploiService chercheurEmploiService) {
        this.documentService = documentService;
        this.chercheurEmploiService = chercheurEmploiService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Document>> getUserDocuments(@PathVariable Long userId) {
        List<Document> documents = documentService.getAllDocumentsByUser(userId);
        return ResponseEntity.ok(documents);
    }

    @GetMapping("/user/{userId}/type/{type}")
    public ResponseEntity<List<Document>> getUserDocumentsByType(
            @PathVariable Long userId, 
            @PathVariable String type) {
        List<Document> documents = documentService.getDocumentsByUserAndType(userId, type);
        return ResponseEntity.ok(documents);
    }

    @GetMapping("/user/{userId}/stats")
    public ResponseEntity<Map<String, Long>> getDocumentStats(@PathVariable Long userId) {
        Map<String, Long> stats = new HashMap<>();
        stats.put("cvCount", documentService.countDocumentsByType(userId, "cv"));
        stats.put("coverLetterCount", documentService.countDocumentsByType(userId, "coverLetter"));
        return ResponseEntity.ok(stats);
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<Document> uploadDocument(
            @PathVariable Long userId, 
            @RequestBody Document document) {
        try {
            ChercheurEmploi chercheur = chercheurEmploiService.getChercheurById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            document.setChercheur(chercheur);
            Document savedDocument = documentService.saveDocument(document);
            return ResponseEntity.ok(savedDocument);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{documentId}")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long documentId) {
        try {
            documentService.deleteDocument(documentId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{documentId}")
    public ResponseEntity<Document> updateDocument(
            @PathVariable Long documentId, 
            @RequestBody Document documentDetails) {
        try {
            Document existingDoc = documentService.getDocumentById(documentId)
                    .orElseThrow(() -> new RuntimeException("Document not found"));
            
            existingDoc.setName(documentDetails.getName());
            existingDoc.setDefault(documentDetails.isDefault());
            
            Document updated = documentService.saveDocument(existingDoc);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
