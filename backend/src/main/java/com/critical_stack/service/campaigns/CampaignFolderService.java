package com.critical_stack.service.campaigns;

import com.critical_stack.domain.CampaignDomain;
import com.critical_stack.domain.CampaignFolderDomain;
import com.critical_stack.domain.CampaignGridDomain;
import com.critical_stack.dto.campaign.request.CreateFolderRequest;
import com.critical_stack.dto.campaign.request.UpdateFolderRequest;
import com.critical_stack.dto.campaign.response.CampaignFolderListResponse;
import com.critical_stack.dto.campaign.response.CampaignFolderResponse;
import com.critical_stack.dto.campaign.response.CampaignGridListResponse;
import com.critical_stack.dto.campaign.response.CampaignSearchResponse;
import com.critical_stack.exception.CampaignFolderNameAlreadyExistsException;
import com.critical_stack.exception.CampaignFolderNotFoundException;
import com.critical_stack.exception.CampaignGridNameAlreadyExistsException;
import com.critical_stack.exception.CampaignGridNotFoundException;
import com.critical_stack.mapper.campaign.CampaignFolderMapper;
import com.critical_stack.mapper.campaign.CampaignGridMapper;
import com.critical_stack.repository.CampaignFolderRepository;
import com.critical_stack.repository.CampaignGridRepository;
import com.critical_stack.validator.CampaignFolderValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.critical_stack.mapper.campaign.CampaignFolderMapper.toDomain;
import static com.critical_stack.mapper.campaign.CampaignFolderMapper.toResponse;
import static com.critical_stack.mapper.campaign.CampaignSearchMapper.toResponse;

@Service
@RequiredArgsConstructor
public class CampaignFolderService {

    private final CampaignFolderValidator campaignFolderValidator;
    private final CampaignFolderRepository campaignFolderRepository;
    private final CampaignGridRepository campaignGridRepository;

    @Transactional(readOnly = true)
    public CampaignSearchResponse search(Long campaignId, String q) {
        CampaignDomain campaign = campaignFolderValidator.validateCampaignAccess(campaignId);

        List<CampaignFolderDomain> allFolders = campaignFolderRepository.findAllByCampaign(campaign);
        List<CampaignGridDomain> allGrids = campaignGridRepository.findAllByCampaign(campaign);

        List<CampaignFolderListResponse> folders = allFolders.stream()
                .filter(f -> q == null || f.getName().toLowerCase().contains(q.toLowerCase()))
                .map(f -> {
                    List<CampaignGridDomain> childGrids = campaignGridRepository.findAllByFolder(f);
                    return CampaignFolderMapper.toResponseList(f, childGrids.size());
                })
                .toList();

        List<CampaignGridListResponse> grids = allGrids.stream()
                .filter(g -> q == null || g.getName().toLowerCase().contains(q.toLowerCase()))
                .map(CampaignGridMapper::toResponseList)
                .toList();

        return toResponse(folders, grids);
    }

    @Transactional(readOnly = true)
    public CampaignFolderResponse getFolderById(Long campaignId, Long folderId) {
        CampaignDomain campaign = campaignFolderValidator.validateCampaignAccess(campaignId);
        CampaignFolderDomain folder = campaignFolderRepository.findById(folderId)
                .orElseThrow(CampaignFolderNotFoundException::new);

        if (!folder.getCampaign().getId().equals(campaignId)) {
            throw new CampaignFolderNotFoundException();
        }

        List<CampaignGridListResponse> grids = campaignGridRepository.findAllByFolder(folder)
                .stream()
                .map(CampaignGridMapper::toResponseList)
                .toList();

        List<CampaignFolderListResponse> children = campaignFolderRepository.findAllByParent(folder)
                .stream()
                .map(f -> {
                    List<CampaignGridDomain> childGrids = campaignGridRepository.findAllByFolder(f);
                    return CampaignFolderMapper.toResponseList(f, childGrids.size());
                })
                .toList();

        return toResponse(folder, grids, children);
    }

    @Transactional
    public CampaignFolderResponse createFolder(Long campaignId, CreateFolderRequest request) {
        CampaignDomain campaign = campaignFolderValidator.validateCampaignAccess(campaignId);

        CampaignFolderDomain folder = toDomain(campaign, request);

        CampaignFolderDomain parent;
        if (request.getParentId() != null) {
            parent = campaignFolderRepository.findById(request.getParentId())
                    .orElseThrow(CampaignFolderNotFoundException::new);

            if (!parent.getCampaign().getId().equals(campaignId)) {
                throw new CampaignFolderNotFoundException();
            }
        } else {
            parent = campaignFolderRepository.findByCampaignAndParentIsNull(campaign)
                    .orElseThrow(CampaignFolderNotFoundException::new);
        }

        validateFolderName(parent, request.getName(), campaign);

        folder.setParent(parent);

        campaignFolderRepository.save(folder);

        return toResponse(folder, List.of(), List.of());
    }

    @Transactional
    public CampaignFolderResponse updateFolder(Long campaignId, Long folderId, UpdateFolderRequest request) {
        CampaignDomain campaign = campaignFolderValidator.validateCampaignAccess(campaignId);

        CampaignFolderDomain folder = campaignFolderRepository.findById(folderId)
                .orElseThrow(CampaignFolderNotFoundException::new);

        if (!folder.getCampaign().getId().equals(campaignId)) {
            throw new CampaignFolderNotFoundException();
        }

        CampaignFolderDomain targetParent;
        if (request.getParentId() != null) {
            targetParent = campaignFolderRepository.findById(request.getParentId())
                    .orElseThrow(CampaignFolderNotFoundException::new);

            if (!targetParent.getCampaign().getId().equals(campaignId)) {
                throw new CampaignFolderNotFoundException();
            }

            if (targetParent.getId().equals(folderId)) {
                throw new IllegalArgumentException("A folder cannot be its own parent.");
            }
        } else {
            targetParent = null;
        }

        boolean nameChanged = !folder.getName().equals(request.getName());
        boolean parentChanged = (targetParent == null && folder.getParent() != null)
                || (targetParent != null && !targetParent.equals(folder.getParent()));

        if (nameChanged || parentChanged) {
            validateFolderName(targetParent, request.getName(), campaign);
        }

        folder.setName(request.getName());

        if (targetParent != null) {
            folder.setParent(targetParent);
        } else {
            folder.setParent(null);
        }

        campaignFolderRepository.save(folder);

        List<CampaignGridListResponse> grids = campaignGridRepository.findAllByFolder(folder)
                .stream()
                .map(CampaignGridMapper::toResponseList)
                .toList();

        List<CampaignFolderListResponse> children = campaignFolderRepository.findAllByParent(folder)
                .stream()
                .map(f -> {
                    List<CampaignGridDomain> childGrids = campaignGridRepository.findAllByFolder(f);
                    return CampaignFolderMapper.toResponseList(f, childGrids.size());
                })
                .toList();

        return toResponse(folder, grids, children);
    }

    @Transactional
    public void deleteFolder(Long campaignId, Long folderId) {
        CampaignDomain campaign = campaignFolderValidator.validateCampaignAccess(campaignId);

        CampaignFolderDomain folder = campaignFolderRepository.findById(folderId)
                .orElseThrow(CampaignFolderNotFoundException::new);

        if (!folder.getCampaign().getId().equals(campaignId)) {
            throw new CampaignFolderNotFoundException();
        }

        if (folder.getParent() == null) {
            throw new IllegalArgumentException("Cannot delete the root folder.");
        }

        List<CampaignGridDomain> gridsInFolder = campaignGridRepository.findAllByFolder(folder);
        campaignGridRepository.deleteAll(gridsInFolder);

        List<CampaignFolderDomain> childFolders = campaignFolderRepository.findAllByParent(folder);
        for (CampaignFolderDomain child : childFolders) {
            deleteFolder(campaignId, child.getId());
        }

        campaignFolderRepository.delete(folder);
    }

    @Transactional
    public void assignGridToFolder(Long campaignId, Long gridId, Long folderId) {
        CampaignDomain campaign = campaignFolderValidator.validateCampaignAccess(campaignId);

        CampaignGridDomain grid = campaignGridRepository.findById(gridId)
                .orElseThrow(CampaignGridNotFoundException::new);

        if (!grid.getCampaign().getId().equals(campaignId)) {
            throw new CampaignGridNotFoundException();
        }

        CampaignFolderDomain folder;
        if (folderId != null) {
            folder = campaignFolderRepository.findById(folderId)
                    .orElseThrow(CampaignFolderNotFoundException::new);

            if (!folder.getCampaign().getId().equals(campaignId)) {
                throw new CampaignFolderNotFoundException();
            }
        } else {
            folder = campaignFolderRepository.findByCampaignAndParentIsNull(campaign)
                    .orElseThrow(CampaignFolderNotFoundException::new);
        }

        if (campaignGridRepository.existsByFolderAndName(folder, grid.getName())) {
            throw new CampaignGridNameAlreadyExistsException();
        }

        grid.setFolder(folder);

        campaignGridRepository.save(grid);
    }

    private void validateFolderName(CampaignFolderDomain parent, String name, CampaignDomain campaign) {
        boolean exists;
        if (parent != null) {
            exists = campaignFolderRepository.existsByParentAndName(parent, name);
        } else {
            exists = campaignFolderRepository.existsByCampaignAndParentIsNullAndName(campaign, name);
        }

        if (exists) {
            throw new CampaignFolderNameAlreadyExistsException();
        }
    }
}
