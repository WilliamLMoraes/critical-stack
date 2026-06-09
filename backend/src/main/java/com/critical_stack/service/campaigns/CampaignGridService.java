package com.critical_stack.service.campaigns;

import com.critical_stack.domain.CampaignDomain;
import com.critical_stack.domain.CampaignGridDomain;
import com.critical_stack.domain.UserDomain;
import com.critical_stack.dto.campaign.request.CampaignGridRequest;
import com.critical_stack.dto.campaign.response.CampaignGridResponse;
import com.critical_stack.exception.CampaignForbiddenException;
import com.critical_stack.exception.CampaignGridNotFoundException;
import com.critical_stack.exception.CampaignNotFoundException;
import com.critical_stack.repository.CampaignGridRepository;
import com.critical_stack.repository.CampaignRepository;
import com.critical_stack.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.critical_stack.mapper.campaign.CampaignGridMapper.*;

@Service
@RequiredArgsConstructor
public class CampaignGridService {

    private final CampaignRepository campaignRepository;
    private final CampaignGridRepository campaignGridRepository;
    private final UserService userService;

    @Transactional(readOnly = true)
    public CampaignGridResponse getGridByCampaignId(Long campaignId) {

        UserDomain user = userService.getUserEntity();

        CampaignDomain campaign = campaignRepository.findByIdAndEnabled(campaignId, true)
                .orElseThrow(CampaignNotFoundException::new);

        if (!campaign.getUserCreator().getId().equals(user.getId())) {
            throw new CampaignForbiddenException();
        }

        CampaignGridDomain grid = campaignGridRepository.findFirstByCampaignOrderByUpdatedAtDesc(campaign)
                .orElseThrow(CampaignGridNotFoundException::new);

        return toResponse(grid);
    }

    @Transactional
    public CampaignGridResponse saveGridByCampaignId(Long campaignId, CampaignGridRequest request) {

        UserDomain user = userService.getUserEntity();

        CampaignDomain campaign = campaignRepository.findByIdAndEnabled(campaignId, true)
                .orElseThrow(CampaignNotFoundException::new);

        if (!campaign.getUserCreator().getId().equals(user.getId())) {
            throw new CampaignForbiddenException();
        }

        CampaignGridDomain grid = campaignGridRepository.findFirstByCampaignOrderByUpdatedAtDesc(campaign)
                .orElseThrow(CampaignGridNotFoundException::new);

        merge(request, grid);

        campaignGridRepository.save(grid);

        return toResponse(grid);
    }
}
