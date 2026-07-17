package br.unesp.backend.infra.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Component
public class JwtTokenProvider {

    private final String secret;
    private final Algorithm algorithm;

    public JwtTokenProvider(@Value("${api.security.token.secret}") String secret) {
        this.secret = secret;
        this.algorithm = Algorithm.HMAC256(secret);
    }

    public String generateToken(Long usuarioId, String role) {
        return JWT.create()
                .withSubject(usuarioId.toString())
                .withClaim("role", role)
                .withIssuedAt(Instant.now())
                .withExpiresAt(Instant.now().plus(7, ChronoUnit.DAYS))
                .sign(algorithm);
    }

    public String validateAndGetSubject(String token) {
        try {
            DecodedJWT decoded = JWT.require(algorithm)
                    .build()
                    .verify(token);
            return decoded.getSubject();
        } catch (JWTVerificationException e) {
            return null;
        }
    }

    public String getRole(String token) {
        try {
            DecodedJWT decoded = JWT.require(algorithm)
                    .build()
                    .verify(token);
            return decoded.getClaim("role").asString();
        } catch (JWTVerificationException e) {
            return null;
        }
    }
}
