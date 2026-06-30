package com.critical_stack.exception;

import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

public class CampaignFolderCannotBeEmptyException extends ResponseStatusException {
    public CampaignFolderCannotBeEmptyException() {
        super(BAD_REQUEST, "A pasta não pode ficar vazia. É necessário ter ao menos uma grade.");
    }
}
