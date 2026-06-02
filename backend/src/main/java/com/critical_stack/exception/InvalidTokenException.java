package com.critical_stack.exception;

import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.UNAUTHORIZED;

public class InvalidTokenException extends ResponseStatusException {
    public InvalidTokenException() {super(UNAUTHORIZED, "Token inválido.");}
}