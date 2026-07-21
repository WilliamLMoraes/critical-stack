package com.critical_stack.service.campaigns;

import com.critical_stack.domain.CampaignDomain;
import com.critical_stack.domain.CampaignFolderDomain;
import com.critical_stack.domain.CampaignGridDomain;
import com.critical_stack.domain.UserDomain;
import com.critical_stack.dto.campaign.request.CreateCampaignRequest;
import com.critical_stack.dto.campaign.request.UpdateCampaignRequest;
import com.critical_stack.dto.campaign.response.CampaignsResponse;
import com.critical_stack.dto.common.PaginatedResponse;
import com.critical_stack.exception.CampaignForbiddenException;
import com.critical_stack.exception.CampaignNotFoundException;
import com.critical_stack.repository.CampaignFolderRepository;
import com.critical_stack.repository.CampaignGridRepository;
import com.critical_stack.repository.CampaignRepository;
import com.critical_stack.service.user.UserService;
import com.critical_stack.validator.UpdateCampaignValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.critical_stack.mapper.campaign.CampaignsMapper.toResponse;
import static com.critical_stack.mapper.campaign.CreateCampaignMapper.toEntity;
import static com.critical_stack.mapper.campaign.UpdateCampaignMapper.toEntity;
import static com.critical_stack.mapper.common.PaginatedMapper.toPaginatedResponse;

@Service
@RequiredArgsConstructor
public class CampaignService {

    private final UserService userService;
    private final CampaignRepository campaignRepository;
    private final CampaignGridRepository campaignGridRepository;
    private final CampaignFolderRepository campaignFolderRepository;
    private final UpdateCampaignValidator updateCampaignValidator;

    public PaginatedResponse<CampaignsResponse> getCampaigns(String query, int page, int size) {

        UserDomain user = userService.getUserEntity();
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Page<CampaignDomain> campaignPage = (query != null && !query.isBlank())
                ? campaignRepository.searchByUser(user, query, pageable)
                : campaignRepository.findAllByUserCreatorAndEnabled(user, true, pageable);

        return toPaginatedResponse(campaignPage, c -> {
            Long rootFolderId = campaignFolderRepository.findByCampaignAndParentIsNull(c)
                    .map(CampaignFolderDomain::getId)
                    .orElse(null);
            return toResponse(c, rootFolderId);
        });
    }

    @Transactional
    public void createCampaign(CreateCampaignRequest request) {

        UserDomain user = userService.getUserEntity();

        CampaignDomain campaign = toEntity(request, user);

        campaignRepository.save(campaign);

        CampaignFolderDomain rootFolder = createRootFolder(campaign);
        createDefaultGrid(campaign, rootFolder);
    }

    private CampaignFolderDomain createRootFolder(CampaignDomain campaign) {
        CampaignFolderDomain rootFolder = CampaignFolderDomain.builder()
                .campaign(campaign)
                .name("Raiz")
                .build();

        return campaignFolderRepository.save(rootFolder);
    }

    private void createDefaultGrid(CampaignDomain campaign, CampaignFolderDomain rootFolder) {

        CampaignGridDomain defaultGrid = CampaignGridDomain.builder()
                .campaign(campaign)
                .folder(rootFolder)
                .name("Grid")
                .width(20)
                .height(20)
                .cellSize(32)
                .lineColor("#cccccc")
                .backgroundColor("#1a1a1a")
                .showGrid(true)
                .showBackgroundImage(false)
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
