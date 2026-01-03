package com.smarthub.smart_career_hub_backend.controller;

import com.smarthub.smart_career_hub_backend.dto.RecruiterStatsDTO;
import com.smarthub.smart_career_hub_backend.service.StatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stats")
public class StatsController {

    @Autowired
    private StatsService statsService;

    @GetMapping("/recruiter/{recruiterId}")
    public ResponseEntity<RecruiterStatsDTO> getRecruiterStats(@PathVariable Long recruiterId) {
        return ResponseEntity.ok(statsService.getRecruiterStats(recruiterId));
    }
}
