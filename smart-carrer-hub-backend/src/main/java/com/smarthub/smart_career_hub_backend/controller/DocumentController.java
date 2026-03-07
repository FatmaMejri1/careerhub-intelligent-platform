package com.smarthub.smart_career_hub_backend.controller;

import com.smarthub.smart_career_hub_backend.entity.Document;
import com.smarthub.smart_career_hub_backend.entity.ChercheurEmploi;
import com.smarthub.smart_career_hub_backend.service.DocumentService;
import com.smarthub.smart_career_hub_backend.service.ChercheurEmploiService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
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

    @GetMapping("/cv")
    public ResponseEntity<Resource> serveCV(@RequestParam String path) {
        try {
            // Basic security check to prevent directory traversal
            if (path.contains("..")) {
                return ResponseEntity.badRequest().build();
            }

            // Get the base directory (root of the project)
            String baseDir = System.getProperty("user.dir");

            // Handle if path already starts with / or \
            if (path.startsWith("/") || path.startsWith("\\")) {
                path = path.substring(1);
            }

            // Construct full path
            Path filePath = Paths.get(baseDir, path);
            File file = filePath.toFile();

            if (!file.exists()) {
                System.err.println("File search failed at: " + file.getAbsolutePath());
                return ResponseEntity.notFound().build();
            }

            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                String contentDisposition = "inline; filename=\"" + resource.getFilename() + "\"";

                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_PDF)
                        .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition)
                        .body(resource);
            } else {
                System.err.println("Resource not readable: " + file.getAbsolutePath());
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
