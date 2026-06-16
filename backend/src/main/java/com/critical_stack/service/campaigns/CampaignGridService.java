package com.critical_stack.service.campaigns;

import com.critical_stack.domain.CampaignDomain;
import com.critical_stack.domain.CampaignGridDomain;
import com.critical_stack.domain.UserDomain;
import com.critical_stack.dto.campaign.request.CampaignGridRequest;
import com.critical_stack.dto.campaign.response.CampaignGridListResponse;
import com.critical_stack.dto.campaign.response.CampaignGridResponse;
import com.critical_stack.exception.CampaignForbiddenException;
import com.critical_stack.exception.CampaignGridNotFoundException;
import com.critical_stack.exception.CampaignNotFoundException;
import com.critical_stack.mapper.campaign.CampaignGridMapper;
import com.critical_stack.repository.CampaignGridRepository;
import com.critical_stack.repository.CampaignRepository;
import com.critical_stack.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.critical_stack.mapper.campaign.CampaignGridMapper.*;

@Service
@RequiredArgsConstructor
public class CampaignGridService {

    private final CampaignRepository campaignRepository;
    private final CampaignGridRepository campaignGridRepository;
    private final UserService userService;

    @Transactional(readOnly = true)
    public List<CampaignGridListResponse> getAllGridsByCampaignId(Long campaignId) {
        UserDomain user = userService.getUserEntity();

        CampaignDomain campaign = campaignRepository.findByIdAndEnabled(campaignId, true)
                .orElseThrow(CampaignNotFoundException::new);

        if (!campaign.getUserCreator().getId().equals(user.getId())) {
            throw new CampaignForbiddenException();
        }

        return campaignGridRepository.findAllByCampaign(campaign)
                .stream()
                .map(CampaignGridMapper::toResponseList)
                .toList();
    }

    @Transactional(readOnly = true)
    public CampaignGridResponse getGridById(Long campaignId, Long gridId) {
        UserDomain user = userService.getUserEntity();

        CampaignDomain campaign = campaignRepository.findByIdAndEnabled(campaignId, true)
                .orElseThrow(CampaignNotFoundException::new);

        if (!campaign.getUserCreator().getId().equals(user.getId())) {
            throw new CampaignForbiddenException();
        }

        CampaignGridDomain grid = campaignGridRepository.findById(gridId)
                .orElseThrow(CampaignGridNotFoundException::new);

        if (!grid.getCampaign().getId().equals(campaignId)) {
            throw new CampaignGridNotFoundException();
        }

        return toResponse(grid);
    }

    @Transactional
    public void createGrid(Long campaignId, CampaignGridRequest request) {
        UserDomain user = userService.getUserEntity();

        CampaignDomain campaign = campaignRepository.findByIdAndEnabled(campaignId, true)
                .orElseThrow(CampaignNotFoundException::new);

        if (!campaign.getUserCreator().getId().equals(user.getId())) {
            throw new CampaignForbiddenException();
        }

        CampaignGridDomain grid = toDomain(request);
        grid.setCampaign(campaign);

        campaignGridRepository.save(grid);
    }

    @Transactional
    public void updateGrid(Long campaignId, Long gridId, CampaignGridRequest request) {
        UserDomain user = userService.getUserEntity();

        CampaignDomain campaign = campaignRepository.findByIdAndEnabled(campaignId, true)
                .orElseThrow(CampaignNotFoundException::new);

        if (!campaign.getUserCreator().getId().equals(user.getId())) {
            throw new CampaignForbiddenException();
        }

        CampaignGridDomain grid = campaignGridRepository.findById(gridId)
                .orElseThrow(CampaignGridNotFoundException::new);

        if (!grid.getCampaign().getId().equals(campaignId)) {
            throw new CampaignGridNotFoundException();
        }

        merge(request, grid);

        campaignGridRepository.save(grid);
    }

    @Transactional
    public void deleteGrid(Long campaignId, Long gridId) {
        UserDomain user = userService.getUserEntity();

        CampaignDomain campaign = campaignRepository.findByIdAndEnabled(campaignId, true)
                .orElseThrow(CampaignNotFoundException::new);

        if (!campaign.getUserCreator().getId().equals(user.getId())) {
            throw new CampaignForbiddenException();
        }

        CampaignGridDomain grid = campaignGridRepository.findById(gridId)
                .orElseThrow(CampaignGridNotFoundException::new);

        if (!grid.getCampaign().getId().equals(campaignId)) {
            throw new CampaignGridNotFoundException();
        }

        campaignGridRepository.delete(grid);
    }
}
