package com.smarthub.smart_career_hub_backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "opportunities")
public class Opportunity {

    @Id
    private String id = UUID.randomUUID().toString();
    private String title;
    private String company;
    private String location;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private String salary;
    private String link;
    private String type; // Full-time, Part-time, Contract, etc.
    private LocalDateTime postedDate;
    private LocalDateTime scrapedDate;
    

    // Constructors
    public Opportunity() {
    }

    public Opportunity(String title, String company, String location, String link) {
        this();
        this.title = title;
        this.company = company;
        this.location = location;
        this.link = link;
    }

    public Opportunity(String title, String company, String location, String description, String link) {
        this();
        this.title = title;
        this.company = company;
        this.location = location;
        this.description = description;
        this.link = link;
    }

    // Getters and setters
    public String getId() { 
        return id; 
    }
    
    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() { 
        return title; 
    }
    
    public void setTitle(String title) { 
        this.title = title; 
    }
    
    public String getCompany() { 
        return company; 
    }
    
    public void setCompany(String company) { 
        this.company = company; 
    }
    
    public String getLocation() { 
        return location; 
    }
    
    public void setLocation(String location) { 
        this.location = location; 
    }
    
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSalary() {
        return salary;
    }

    public void setSalary(String salary) {
        this.salary = salary;
    }

    public String getLink() { 
        return link; 
    }
    
    public void setLink(String link) { 
        this.link = link; 
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public LocalDateTime getPostedDate() {
        return postedDate;
    }

    public void setPostedDate(LocalDateTime postedDate) {
        this.postedDate = postedDate;
    }

    public LocalDateTime getScrapedDate() {
        return scrapedDate;
    }

    public void setScrapedDate(LocalDateTime scrapedDate) {
        this.scrapedDate = scrapedDate;
    }
}
