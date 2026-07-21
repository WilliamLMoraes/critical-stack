package com.critical_stack.controller;

import com.critical_stack.dto.campaign.request.AssignFolderRequest;
import com.critical_stack.dto.campaign.request.CampaignGridRequest;
import com.critical_stack.dto.campaign.request.CreateCampaignRequest;
import com.critical_stack.dto.campaign.request.CreateFolderRequest;
import com.critical_stack.dto.campaign.request.UpdateCampaignRequest;
import com.critical_stack.dto.campaign.request.UpdateFolderRequest;
import com.critical_stack.dto.campaign.response.CampaignGridResponse;
import com.critical_stack.dto.campaign.response.CampaignSearchResponse;
import com.critical_stack.dto.campaign.response.CampaignsResponse;
import com.critical_stack.dto.campaign.response.CampaignFolderResponse;
import com.critical_stack.dto.common.PaginatedResponse;
import com.critical_stack.service.campaigns.CampaignFolderService;
import com.critical_stack.service.campaigns.CampaignGridService;
import com.critical_stack.service.campaigns.CampaignService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.NO_CONTENT;
import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping("/campaigns")
@RequiredArgsConstructor
public class CampaignController {

    private final CampaignService campaignService;
    private final CampaignGridService campaignGridService;
    private final CampaignFolderService campaignFolderService;

    @GetMapping
    public PaginatedResponse<CampaignsResponse> getMyCampaigns(
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size) {
        return campaignService.getCampaigns(q, page, size);
    }

    @PostMapping
    @ResponseStatus(CREATED)
    public void create(@Valid @RequestBody CreateCampaignRequest request) {
        campaignService.createCampaign(request);
    };

    @PutMapping("/{id}")
    @ResponseStatus(NO_CONTENT)
    public void update(@PathVariable Long id, @Valid @RequestBody UpdateCampaignRequest request) {
        campaignService.updateCampaign(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(NO_CONTENT)
    public void delete(@PathVariable Long id) {
        campaignService.deleteCampaign(id);
    }

    @GetMapping("/{campaignId}/search")
    @ResponseStatus(OK)
    public CampaignSearchResponse search(
            @PathVariable Long campaignId,
            @RequestParam(required = false) String q) {
        return campaignFolderService.search(campaignId, q);
    }

    @GetMapping("/{campaignId}/grid/{gridId}")
    @ResponseStatus(OK)
    public CampaignGridResponse getGrid(@PathVariable Long campaignId, @PathVariable Long gridId) {
        return campaignGridService.getGridById(campaignId, gridId);
    }

    @PostMapping("/{campaignId}/grid")
    @ResponseStatus(CREATED)
    public void createGrid(@PathVariable Long campaignId, @Valid @RequestBody CampaignGridRequest request) {
        campaignGridService.createGrid(campaignId, request);
    }

    @PutMapping("/{campaignId}/grid/{gridId}")
    @ResponseStatus(NO_CONTENT)
    public void updateGrid(@PathVariable Long campaignId, @PathVariable Long gridId, @Valid @RequestBody CampaignGridRequest request) {
        campaignGridService.updateGrid(campaignId, gridId, request);
    }

    @DeleteMapping("/{campaignId}/grid/{gridId}")
    @ResponseStatus(NO_CONTENT)
    public void deleteGrid(@PathVariable Long campaignId, @PathVariable Long gridId) {
        campaignGridService.deleteGrid(campaignId, gridId);
    }

    @GetMapping("/{campaignId}/folder/{folderId}")
    @ResponseStatus(OK)
    public CampaignFolderResponse getFolder(@PathVariable Long campaignId, @PathVariable Long folderId) {
        return campaignFolderService.getFolderById(campaignId, folderId);
    }

    @PostMapping("/{campaignId}/folder")
    @ResponseStatus(CREATED)
    public CampaignFolderResponse createFolder(@PathVariable Long campaignId, @Valid @RequestBody CreateFolderRequest request) {
        return campaignFolderService.createFolder(campaignId, request);
    }

    @PutMapping("/{campaignId}/folder/{folderId}")
    @ResponseStatus(OK)
    public CampaignFolderResponse updateFolder(@PathVariable Long campaignId, @PathVariable Long folderId, @Valid @RequestBody UpdateFolderRequest request) {
        return campaignFolderService.updateFolder(campaignId, folderId, request);
    }

    @DeleteMapping("/{campaignId}/folder/{folderId}")
    @ResponseStatus(NO_CONTENT)
    public void deleteFolder(@PathVariable Long campaignId, @PathVariable Long folderId) {
        campaignFolderService.deleteFolder(campaignId, folderId);
    }

    @PostMapping("/{campaignId}/grid/{gridId}/assign-folder")
    @ResponseStatus(NO_CONTENT)
    public void assignGridToFolder(@PathVariable Long campaignId, @PathVariable Long gridId, @Valid @RequestBody AssignFolderRequest request) {
        campaignFolderService.assignGridToFolder(campaignId, gridId, request.getFolderId());
    }

}
