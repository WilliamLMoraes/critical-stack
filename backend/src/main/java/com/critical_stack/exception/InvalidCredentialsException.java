package com.critical_stack.exception;

import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.UNAUTHORIZED;

public class InvalidCredentialsException extends ResponseStatusException {
    public InvalidCredentialsException() {
        super(UNAUTHORIZED, "Email ou senha inválidos.");
    }
}
