package com.smarthub.smart_career_hub_backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class RegisterRequest {
    private String email;
    private String password;
    private String fullName;
    private String phone;
    private String objective;
    private List<String> interests;
    private String experience;
    // Optional role, default to CANDIDATE
    private String role;
    
    // Recruiter-specific fields
    private String companyName;
    private String website;
    private String jobTitle;
    private String companyAddress;
}
