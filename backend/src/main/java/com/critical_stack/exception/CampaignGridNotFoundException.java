package com.critical_stack.exception;

import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.NOT_FOUND;

public class CampaignGridNotFoundException extends ResponseStatusException {
    public CampaignGridNotFoundException() {
        super(NOT_FOUND, "Grid não encontrado.");
    }
}
