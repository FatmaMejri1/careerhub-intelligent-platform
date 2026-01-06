package com.smarthub.smart_career_hub_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @Autowired
    private com.smarthub.smart_career_hub_backend.repository.UtilisateurRepository utilisateurRepository;

    @GetMapping("/hello")
    public String hello() {
        return "Backend Smart Career Hub fonctionne ✅";
    }

    @GetMapping("/users")
    public java.util.List<com.smarthub.smart_career_hub_backend.entity.Utilisateur> getUsers() {
        return utilisateurRepository.findAll();
    }
}

