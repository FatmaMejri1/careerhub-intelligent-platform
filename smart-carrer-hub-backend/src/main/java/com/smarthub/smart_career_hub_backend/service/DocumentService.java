package com.smarthub.smart_career_hub_backend.service;

import com.smarthub.smart_career_hub_backend.entity.Document;
import com.smarthub.smart_career_hub_backend.repository.DocumentRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class DocumentService {
    private final DocumentRepository documentRepository;

    public DocumentService(DocumentRepository documentRepository) {
        this.documentRepository = documentRepository;
    }

    public List<Document> getDocumentsByUserAndType(Long chercheurId, String type) {
        return documentRepository.findByChercheurIdAndType(chercheurId, type);
    }

    public List<Document> getAllDocumentsByUser(Long chercheurId) {
        return documentRepository.findByChercheurId(chercheurId);
    }

    public Document saveDocument(Document document) {
        return documentRepository.save(document);
    }

    public void deleteDocument(Long id) {
        documentRepository.deleteById(id);
    }

    public Optional<Document> getDocumentById(Long id) {
        return documentRepository.findById(id);
    }

    public long countDocumentsByType(Long chercheurId, String type) {
        return documentRepository.countByChercheurIdAndType(chercheurId, type);
    }
}
