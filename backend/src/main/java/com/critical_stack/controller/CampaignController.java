package com.critical_stack.controller;

import com.critical_stack.dto.campaign.request.CampaignGridRequest;
import com.critical_stack.dto.campaign.request.CreateCampaignRequest;
import com.critical_stack.dto.campaign.request.UpdateCampaignRequest;
import com.critical_stack.dto.campaign.response.CampaignGridListResponse;
import com.critical_stack.dto.campaign.response.CampaignGridResponse;
import com.critical_stack.dto.campaign.response.CampaignsResponse;
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

    @GetMapping
    public List<CampaignsResponse> getMyCampaigns() {
        return campaignService.getCampaigns();
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

    @GetMapping("/{campaignId}/grid")
    @ResponseStatus(OK)
    public List<CampaignGridListResponse> getAllGrids(@PathVariable Long campaignId) {
        return campaignGridService.getAllGridsByCampaignId(campaignId);
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
}
