package com.smarthub.smart_career_hub_backend.repository;

import com.smarthub.smart_career_hub_backend.entity.Offre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OffreRepository extends JpaRepository<Offre, Long> { }
