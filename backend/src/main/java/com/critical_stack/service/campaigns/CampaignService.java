package com.critical_stack.service.campaigns;

import com.critical_stack.domain.CampaignDomain;
import com.critical_stack.domain.CampaignGridDomain;
import com.critical_stack.domain.UserDomain;
import com.critical_stack.dto.campaign.request.CreateCampaignRequest;
import com.critical_stack.dto.campaign.request.UpdateCampaignRequest;
import com.critical_stack.dto.campaign.response.CampaignsResponse;
import com.critical_stack.exception.CampaignForbiddenException;
import com.critical_stack.exception.CampaignNotFoundException;
import com.critical_stack.exception.UserNotFoundException;
import com.critical_stack.mapper.campaign.CampaignsMapper;
import com.critical_stack.mapper.campaign.UpdateCampaignMapper;
import com.critical_stack.repository.CampaignGridRepository;
import com.critical_stack.repository.CampaignRepository;
import com.critical_stack.service.user.UserService;
import com.critical_stack.validator.CreateCampaignValidator;
import com.critical_stack.validator.UpdateCampaignValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.critical_stack.mapper.campaign.CreateCampaignMapper.toEntity;
import static com.critical_stack.mapper.campaign.UpdateCampaignMapper.toEntity;

@Service
@RequiredArgsConstructor
public class CampaignService {

    private final UserService userService;
    private final CampaignRepository campaignRepository;
    private final CampaignGridRepository campaignGridRepository;
    private final CreateCampaignValidator createCampaignValidator;
    private final UpdateCampaignValidator updateCampaignValidator;

    public List<CampaignsResponse> getCampaigns() {

        UserDomain user = userService.getUserEntity();

        List<CampaignDomain> campaigns = campaignRepository.findAllByUserCreatorAndEnabled(user, true);

        return campaigns.stream()
                .map(CampaignsMapper::toResponse)
                .toList();
    }

    @Transactional
    public void createCampaign(CreateCampaignRequest request) {

        createCampaignValidator.validate(request);

        UserDomain user = userService.getUserEntity();

        CampaignDomain campaign = toEntity(request, user);

        campaignRepository.save(campaign);

        createDefaultGrid(campaign);
    }

    private void createDefaultGrid(CampaignDomain campaign) {

        CampaignGridDomain defaultGrid = CampaignGridDomain.builder()
                .campaign(campaign)
                .name("Grid")
                .width(20)
                .height(20)
                .cellSize(32)
                .lineColor("#cccccc")
                .backgroundColor("#1a1a1a")
                .showGrid(true)
                .build();

        campaignGridRepository.save(defaultGrid);
    }

    @Transactional
    public void updateCampaign(Long id, UpdateCampaignRequest request) {

        UserDomain user = userService.getUserEntity();

        CampaignDomain campaign = campaignRepository.findByIdAndEnabled(id, true)
                .orElseThrow(CampaignNotFoundException::new);

        if (!campaign.getUserCreator().getId().equals(user.getId())) {
            throw new CampaignForbiddenException();
        }

        updateCampaignValidator.validate(request, id);

        toEntity(request, campaign);

        campaignRepository.save(campaign);
    }

    @Transactional
    public void deleteCampaign(Long id) {

        UserDomain user = userService.getUserEntity();

        CampaignDomain campaign = campaignRepository.findByIdAndEnabled(id, true)
                .orElseThrow(CampaignNotFoundException::new);

        if (!campaign.getUserCreator().getId().equals(user.getId())) {
            throw new CampaignForbiddenException();
        }

        campaign.setEnabled(false);

        campaignRepository.save(campaign);
    }
}
