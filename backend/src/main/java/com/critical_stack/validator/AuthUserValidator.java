package com.critical_stack.validator;

import com.critical_stack.exception.InvalidCredentialsException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AuthUserValidator {

    private final PasswordEncoder passwordEncoder;

    public void authenticate(String passwordRequest, String passwordUser) {

        if (!passwordEncoder.matches(passwordRequest, passwordUser)) {
            throw new InvalidCredentialsException();
        }
    }
}
