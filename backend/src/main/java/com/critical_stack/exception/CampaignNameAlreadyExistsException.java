package com.critical_stack.exception;

import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

public class CampaignNameAlreadyExistsException extends ResponseStatusException  {
    public CampaignNameAlreadyExistsException() {
        super(BAD_REQUEST, "O Nome da mesa ja esta em uso.");
    }
}
