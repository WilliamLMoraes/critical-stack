package com.critical_stack.service.campaigns;

import com.critical_stack.domain.CampaignDomain;
import com.critical_stack.domain.UserDomain;
import com.critical_stack.dto.campaign.request.CreateCampaignRequest;
import com.critical_stack.dto.campaign.response.CampaignsResponse;
import com.critical_stack.mapper.campaign.CampaignsMapper;
import com.critical_stack.repository.CampaignRepository;
import com.critical_stack.service.user.UserService;
import com.critical_stack.validator.CreateCampaignValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.critical_stack.mapper.campaign.CreateCampaignMapper.toEntity;

@Service
@RequiredArgsConstructor
public class CampaignService {

    private final UserService userService;
    private final CampaignRepository campaignRepository;
    private final CreateCampaignValidator createCampaignValidator;

    public List<CampaignsResponse> getCampaigns() {

        UserDomain user = userService.getUserEntity();

        List<CampaignDomain> campaigns = campaignRepository.findAllByUserCreator(user);

        return campaigns.stream()
                .map(CampaignsMapper::toResponse)
                .toList();
    }

    public void createCampaign(CreateCampaignRequest request) {

        createCampaignValidator.validate(request);

        UserDomain user = userService.getUserEntity();

        CampaignDomain campaign = toEntity(request, user);

        campaignRepository.save(campaign);
    }
}
