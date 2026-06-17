package com.critical_stack.exception;

import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.NOT_FOUND;

public class CampaignFolderNotFoundException extends ResponseStatusException {
    public CampaignFolderNotFoundException() {
        super(NOT_FOUND, "Pasta não encontrada.");
    }
}
