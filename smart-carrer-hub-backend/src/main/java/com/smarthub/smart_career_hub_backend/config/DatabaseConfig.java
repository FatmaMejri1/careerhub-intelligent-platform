package com.smarthub.smart_career_hub_backend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class DatabaseConfig {

    @Bean
    public CommandLineRunner fixDatabaseSequences(JdbcTemplate jdbcTemplate) {
        return args -> {
            try {
                System.out.println("DEBUG: Starting Database Sequence Fix...");
                
                // Fix sequence for 'offres' table
                jdbcTemplate.execute("SELECT setval(pg_get_serial_sequence('offres', 'id'), (SELECT MAX(id) FROM offres))");
                System.out.println("DEBUG: Fixed sequence for 'offres'");

                // Fix sequence for 'utilisateurs' if it exists
                try {
                    jdbcTemplate.execute("SELECT setval(pg_get_serial_sequence('utilisateurs', 'id'), (SELECT MAX(id) FROM utilisateurs))");
                    System.out.println("DEBUG: Fixed sequence for 'utilisateurs'");
                } catch (Exception e) {}

                // Fix sequence for 'candidatures' if it exists
                try {
                    jdbcTemplate.execute("SELECT setval(pg_get_serial_sequence('candidatures', 'id'), (SELECT MAX(id) FROM candidatures))");
                    System.out.println("DEBUG: Fixed sequence for 'candidatures'");
                } catch (Exception e) {}

                System.out.println("DEBUG: Database Sequence Fix Completed Successfully.");
            } catch (Exception e) {
                System.err.println("DEBUG: Error fixing sequences: " + e.getMessage());
                // Non-fatal error, likely tables don't exist yet or no data
            }
        };
    }
}
