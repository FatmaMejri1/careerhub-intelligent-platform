package com.smarthub.smart_career_hub_backend.security;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import java.util.Date;
import java.util.function.Function;
@Component
public class JwtTokenUtil {
    @Value("${security.jwt.secret:ChangeThisSecretKeyToASecureValue}")
    private String secret;
    @Value("${security.jwt.expiration-ms:3600000}")
    private long jwtExpirationInMs;
    public String generateToken(String username) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(SignatureAlgorithm.HS256, secret)
                .compact();
    }
    public String getUsernameFromToken(String token) {
        return getClaimFromToken(token, Claims::getSubject);
    }
    public Date getExpirationDateFromToken(String token) {
        return getClaimFromToken(token, Claims::getExpiration);
    }
    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        // TODO: Fix JWT API compatibility
        // final Claims claims = Jwts.parser().setSigningKey(secret).parseClaimsJws(token).getBody();
        // return claimsResolver.apply(claims);
        return null;
    }
    public boolean validateToken(String token, UserDetails userDetails) {
        try {
            final Date exp = getExpirationDateFromToken(token);
            return exp != null && exp.after(new Date());
        } catch (Exception ex) {
            return false;
        }
    }

    public String getUsername(String jwt) {
        return jwt;
    }
}