package com.critical_stack.exception;

import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

public class CampaignGridNameAlreadyExistsException extends ResponseStatusException {
    public CampaignGridNameAlreadyExistsException() {
        super(BAD_REQUEST, "Já existe um grid com este nome nesta pasta.");
    }
}
