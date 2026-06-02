package com.critical_stack.service.user;

import com.critical_stack.domain.UserDomain;
import com.critical_stack.exception.UserNotFoundException;
import com.critical_stack.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class JWTUserService {

    private final UserRepository userRepository;
    private final JwtEncoder jwtEncoder;


    public Long getAuthenticatedUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        Jwt jwt = (Jwt) authentication.getPrincipal();
        return jwt.getClaim("id");
    }

    public UserDomain getLoggedUserDomain() {
        return userRepository.findById(getAuthenticatedUserId())
                .orElseThrow(UserNotFoundException::new);
    }

    public String generateToken(UserDomain user, long expiresIn) {

        Instant issuedAt  = Instant.now();
        Instant expirationTime = issuedAt.plusSeconds(expiresIn);

        JwtClaimsSet jwt = JwtClaimsSet.builder()
                .issuer("Critical-Stack")
                .subject(user.getId().toString())
                .issuedAt(issuedAt)
                .expiresAt(expirationTime)
                .claim("id", user.getId())
                .build();

        return jwtEncoder.encode(JwtEncoderParameters.from(jwt)).getTokenValue();
    }
}
