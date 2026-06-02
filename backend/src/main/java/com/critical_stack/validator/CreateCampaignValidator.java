package com.critical_stack.validator;

import com.critical_stack.dto.campaign.request.CreateCampaignRequest;
import com.critical_stack.exception.UserEmailAlreadyExistsException;
import com.critical_stack.repository.CampaignRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class CreateCampaignValidator {

    private final CampaignRepository campaignRepository;

    public void validate(CreateCampaignRequest request) {

        if (campaignRepository.existsByName(request.getName())) {
            throw new UserEmailAlreadyExistsException();
        }
    }
}
