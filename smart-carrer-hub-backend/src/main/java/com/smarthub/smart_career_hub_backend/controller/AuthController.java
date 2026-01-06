package com.smarthub.smart_career_hub_backend.controller;

import com.smarthub.smart_career_hub_backend.dto.LoginRequest;
import com.smarthub.smart_career_hub_backend.dto.RegisterRequest;
import com.smarthub.smart_career_hub_backend.entity.ChercheurEmploi;
import com.smarthub.smart_career_hub_backend.entity.Recruteur;
import com.smarthub.smart_career_hub_backend.entity.Utilisateur;
import com.smarthub.smart_career_hub_backend.enums.Role;
import com.smarthub.smart_career_hub_backend.repository.UtilisateurRepository;
import com.smarthub.smart_career_hub_backend.security.JwtTokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            System.out.println("Login attempt for email: " + loginRequest.getEmail());
            Optional<Utilisateur> userOpt = utilisateurRepository.findByEmail(loginRequest.getEmail());

            if (userOpt.isPresent()) {
                Utilisateur user = userOpt.get();
                System.out.println("User found: " + user.getEmail() + ", Role: " + user.getRole());

                String storedPassword = user.getMotDePasse();
                if (storedPassword == null) {
                    System.out.println("Error: Stored password is null for user " + user.getEmail());
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body(Map.of("message", "User account data corrupted (missing password)"));
                }

                // TODO: Use PasswordEncoder
                if (storedPassword.equals(loginRequest.getPassword())) {
                    System.out.println("Password match successful");
                    String token = jwtTokenUtil.generateToken(user.getEmail());
                    Map<String, Object> response = new HashMap<>();
                    response.put("token", token);
                    response.put("id", user.getId());
                    response.put("email", user.getEmail());
                    response.put("role", mapRoleToFrontendIdentifier(user.getRole()));
                    response.put("name", user.getNom() + " " + user.getPrenom());
                    return ResponseEntity.ok(response);
                } else {
                    System.out.println("Password mismatch");
                }
            } else {
                System.out.println("User not found for email: " + loginRequest.getEmail());
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid credentials"));
        } catch (Exception e) {
            System.err.println("CRITICAL: Login failure for email: " + loginRequest.getEmail());
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Login error: " + (e.getMessage() != null ? e.getMessage() : e.toString()));
            errorResponse.put("type", e.getClass().getName());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        try {
            if (utilisateurRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Email already in use"));
            }

            if ("recruiter".equalsIgnoreCase(registerRequest.getRole())) {
                Recruteur newRecruteur = new Recruteur();
                newRecruteur.setEmail(registerRequest.getEmail());
                newRecruteur.setMotDePasse(registerRequest.getPassword());
                String[] names = (registerRequest.getFullName() != null ? registerRequest.getFullName() : "")
                        .split(" ");
                newRecruteur.setNom(names.length > 0 ? names[0] : "");
                newRecruteur.setPrenom(names.length > 1 ? names[1] : "");
                newRecruteur.setTelephone(registerRequest.getPhone());
                newRecruteur.setRole(Role.ROLE_RECRUTEUR);

                // Recruiter-specific fields
                newRecruteur.setNomEntreprise(registerRequest.getCompanyName());
                newRecruteur.setSiteWeb(registerRequest.getWebsite());
                newRecruteur.setPoste(registerRequest.getJobTitle());
                newRecruteur.setAdresseEntreprise(registerRequest.getCompanyAddress());

                utilisateurRepository.save(newRecruteur);

                String token = jwtTokenUtil.generateToken(newRecruteur.getEmail());
                Map<String, Object> response = new HashMap<>();
                response.put("token", token);
                response.put("id", newRecruteur.getId());
                response.put("email", newRecruteur.getEmail());
                response.put("role", mapRoleToFrontendIdentifier(newRecruteur.getRole()));
                response.put("name", newRecruteur.getNom() + " " + newRecruteur.getPrenom());
                return ResponseEntity.ok(response);
            }

            // Default to Chercheur for now as per frontend flow
            ChercheurEmploi newUser = new ChercheurEmploi();
            newUser.setEmail(registerRequest.getEmail());
            newUser.setMotDePasse(registerRequest.getPassword());

            // Split name or just set as nom
            String[] names = (registerRequest.getFullName() != null ? registerRequest.getFullName() : "").split(" ");
            newUser.setNom(names.length > 0 ? names[0] : "");
            newUser.setPrenom(names.length > 1 ? names[1] : "");
            newUser.setTelephone(registerRequest.getPhone());
            newUser.setRole(Role.ROLE_CANDIDAT);

            // Job seeker specific fields
            newUser.setObjectif(registerRequest.getObjective());
            newUser.setNiveauExperience(registerRequest.getExperience());
            if (registerRequest.getInterests() != null && !registerRequest.getInterests().isEmpty()) {
                // Store as JSON string
                newUser.setCompetences(String.join(",", registerRequest.getInterests()));
            }

            utilisateurRepository.save(newUser);

            String token = jwtTokenUtil.generateToken(newUser.getEmail());
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("id", newUser.getId());
            response.put("email", newUser.getEmail());
            response.put("role", mapRoleToFrontendIdentifier(newUser.getRole()));
            response.put("name", newUser.getNom() + " " + newUser.getPrenom());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("message", "Registration failed: " + e.getMessage());
            error.put("error", e.getClass().getSimpleName());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    private String mapRoleToFrontendIdentifier(Role role) {
        if (role == null)
            return "candidate";
        String r = role.name();
        if (r.contains("ADMIN"))
            return "admin";
        if (r.contains("RECRUTEUR"))
            return "recruiter";
        return "candidate";
    }
}
