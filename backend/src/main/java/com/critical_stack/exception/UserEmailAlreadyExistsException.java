package com.critical_stack.exception;

import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

public class UserEmailAlreadyExistsException extends ResponseStatusException  {
    public UserEmailAlreadyExistsException() {
        super(BAD_REQUEST, "O e-mail já está em uso.");
    }
}
