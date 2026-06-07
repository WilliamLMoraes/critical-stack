package com.critical_stack.exception;

import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.FORBIDDEN;

public class CampaignForbiddenException extends ResponseStatusException {
    public CampaignForbiddenException() {
        super(FORBIDDEN, "Você não tem permissão para esta ação.");
    }
}
