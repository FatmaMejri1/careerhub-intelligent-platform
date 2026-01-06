package com.smarthub.smart_career_hub_backend.controller;

import com.smarthub.smart_career_hub_backend.entity.Opportunity;
import com.smarthub.smart_career_hub_backend.service.OpportunityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/opportunities")
public class OpportunityController {

    @Autowired
    private OpportunityService opportunityService;

    @GetMapping
    public ResponseEntity<List<Opportunity>> getAllOpportunities() {
        return ResponseEntity.ok(opportunityService.getAllOpportunities());
    }

    @PostMapping
    public ResponseEntity<Opportunity> createOpportunity(@RequestBody Opportunity opportunity) {
        return ResponseEntity.ok(opportunityService.saveOpportunity(opportunity));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Opportunity>> searchOpportunities(@RequestParam String keyword) {
        return ResponseEntity.ok(opportunityService.searchOpportunities(keyword));
    }

    @PostMapping("/scrape")
    public ResponseEntity<List<Opportunity>> triggerScrape(
            @RequestParam(required = false, defaultValue = "default") String url) {
        return ResponseEntity.ok(opportunityService.scrapeToppportunities(url));
    }
}
