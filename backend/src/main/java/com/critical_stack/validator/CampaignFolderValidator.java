package com.critical_stack.validator;

import com.critical_stack.domain.CampaignDomain;
import com.critical_stack.domain.UserDomain;
import com.critical_stack.exception.CampaignForbiddenException;
import com.critical_stack.exception.CampaignNotFoundException;
import com.critical_stack.repository.CampaignRepository;
import com.critical_stack.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class CampaignFolderValidator {

    private final CampaignRepository campaignRepository;
    private final UserService userService;

    public CampaignDomain validateCampaignAccess(Long campaignId) {
        UserDomain user = userService.getUserEntity();
        CampaignDomain campaign = campaignRepository.findByIdAndEnabled(campaignId, true)
                .orElseThrow(CampaignNotFoundException::new);

        if (!campaign.getUserCreator().getId().equals(user.getId())) {
            throw new CampaignForbiddenException();
        }
        return campaign;
    }
}
