package com.smarthub.smart_career_hub_backend.controller;

import com.smarthub.smart_career_hub_backend.entity.Offre;
import com.smarthub.smart_career_hub_backend.service.OffreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/offre")
public class OffreController {

    @Autowired
    private OffreService offreService;

    @GetMapping
    public List<Offre> getAll() {
        return offreService.getAllOffres();
    }

    @GetMapping("/{id}")
    public Optional<Offre> getById(@PathVariable Long id) {
        return offreService.getOffreById(id);
    }

    @PostMapping
    public Offre create(@RequestBody Offre offre) {
        return offreService.createOffre(offre);
    }

    @PutMapping("/{id}")
    public Offre update(@PathVariable Long id, @RequestBody Offre offre) {
        return offreService.updateOffre(id, offre);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        offreService.deleteOffre(id);
    }
}
