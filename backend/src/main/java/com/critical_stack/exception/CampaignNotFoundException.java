package com.critical_stack.exception;

import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.NOT_FOUND;

public class CampaignNotFoundException extends ResponseStatusException {
    public CampaignNotFoundException() {
        super(NOT_FOUND, "Campanha não encontrada.");
    }
}
