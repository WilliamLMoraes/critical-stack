package com.critical_stack.validator;

import com.critical_stack.dto.campaign.request.UpdateCampaignRequest;
import com.critical_stack.exception.CampaignNameAlreadyExistsException;
import com.critical_stack.repository.CampaignRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class UpdateCampaignValidator {

    private final CampaignRepository campaignRepository;

    public void validate(UpdateCampaignRequest request, Long campaignId) {

        if (campaignRepository.existsByNameAndIdNot(request.getName(), campaignId)) {
            throw new CampaignNameAlreadyExistsException();
        }
    }
}
