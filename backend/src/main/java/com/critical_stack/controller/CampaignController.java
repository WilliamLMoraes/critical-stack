package com.critical_stack.controller;

import com.critical_stack.dto.campaign.request.CampaignGridRequest;
import com.critical_stack.dto.campaign.request.CreateCampaignRequest;
import com.critical_stack.dto.campaign.request.UpdateCampaignRequest;
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
    public CampaignGridResponse getGrid(@PathVariable Long campaignId) {
        return campaignGridService.getGridByCampaignId(campaignId);
    }

    @PutMapping("/{campaignId}/grid")
    @ResponseStatus(OK)
    public CampaignGridResponse saveGrid(@PathVariable Long campaignId, @Valid @RequestBody CampaignGridRequest request) {
        return campaignGridService.saveGridByCampaignId(campaignId, request);
    }
}
