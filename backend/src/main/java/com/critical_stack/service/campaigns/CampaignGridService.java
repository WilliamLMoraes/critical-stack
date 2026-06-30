package com.critical_stack.service.campaigns;

import com.critical_stack.domain.CampaignDomain;
import com.critical_stack.domain.CampaignFolderDomain;
import com.critical_stack.domain.CampaignGridDomain;
import com.critical_stack.domain.UserDomain;
import com.critical_stack.dto.campaign.request.CampaignGridRequest;
import com.critical_stack.dto.campaign.response.CampaignGridResponse;
import com.critical_stack.exception.CampaignFolderCannotBeEmptyException;
import com.critical_stack.exception.CampaignFolderNotFoundException;
import com.critical_stack.exception.CampaignForbiddenException;
import com.critical_stack.exception.CampaignGridNameAlreadyExistsException;
import com.critical_stack.exception.CampaignGridNotFoundException;
import com.critical_stack.exception.CampaignNotFoundException;
import com.critical_stack.mapper.campaign.CampaignGridMapper;
import com.critical_stack.repository.CampaignFolderRepository;
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
    private final CampaignFolderRepository campaignFolderRepository;
    private final UserService userService;

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

        CampaignFolderDomain folder;
        if (request.getFolderId() != null) {
            folder = campaignFolderRepository.findById(request.getFolderId())
                    .orElseThrow(CampaignFolderNotFoundException::new);
        } else {
            folder = campaignFolderRepository.findByCampaignAndParentIsNull(campaign)
                    .orElseThrow(CampaignFolderNotFoundException::new);
        }

        if (!folder.getCampaign().getId().equals(campaignId)) {
            throw new CampaignFolderNotFoundException();
        }

        if (campaignGridRepository.existsByFolderAndName(folder, request.getName())) {
            throw new CampaignGridNameAlreadyExistsException();
        }

        grid.setFolder(folder);

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

        if (!grid.getName().equals(request.getName()) && campaignGridRepository.existsByFolderAndName(grid.getFolder(), request.getName())) {
            throw new CampaignGridNameAlreadyExistsException();
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

        CampaignFolderDomain folder = grid.getFolder();
        if (campaignGridRepository.countByFolder(folder) <= 1) {
            throw new CampaignFolderCannotBeEmptyException();
        }

        campaignGridRepository.delete(grid);
    }
}
