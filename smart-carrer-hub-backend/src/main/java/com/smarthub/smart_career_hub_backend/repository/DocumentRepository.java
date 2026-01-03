package com.smarthub.smart_career_hub_backend.repository;

import com.smarthub.smart_career_hub_backend.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByChercheurIdAndType(Long chercheurId, String type);
    List<Document> findByChercheurId(Long chercheurId);
    long countByChercheurIdAndType(Long chercheurId, String type);
}
