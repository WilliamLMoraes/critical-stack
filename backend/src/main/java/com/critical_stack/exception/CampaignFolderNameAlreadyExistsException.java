package com.critical_stack.exception;

import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

public class CampaignFolderNameAlreadyExistsException extends ResponseStatusException {
    public CampaignFolderNameAlreadyExistsException() {
        super(BAD_REQUEST, "Já existe uma pasta com este nome no mesmo local.");
    }
}
