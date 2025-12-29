package com.smarthub.smart_career_hub_backend.security;

import com.smarthub.smart_career_hub_backend.entity.Utilisateur;
import com.smarthub.smart_career_hub_backend.repository.UtilisateurRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UtilisateurRepository utilisateurRepository;

    public CustomUserDetailsService(UtilisateurRepository utilisateurRepository) {
        this.utilisateurRepository = utilisateurRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Utilisateur utilisateur = utilisateurRepository.findByEmail(username);
        if (utilisateur == null) {
            throw new UsernameNotFoundException("Utilisateur non trouvé: " + username);
        }

        List<GrantedAuthority> authorities = List.of(
                new SimpleGrantedAuthority(utilisateur.getRole().name())
        );

        return new User(
                utilisateur.getEmail(),
                utilisateur.getMotDePasse(),
                authorities
        );
    }
}
