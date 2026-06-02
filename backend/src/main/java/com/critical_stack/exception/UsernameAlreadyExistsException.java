package com.critical_stack.exception;

import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

public class UsernameAlreadyExistsException extends ResponseStatusException  {
    public UsernameAlreadyExistsException() {
        super(BAD_REQUEST, "O Nome de Usuário já está em uso.");
    }
}
