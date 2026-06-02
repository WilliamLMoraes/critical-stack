package com.critical_stack.controller;

import com.critical_stack.dto.campaign.request.CreateCampaignRequest;
import com.critical_stack.dto.campaign.response.CampaignsResponse;
import com.critical_stack.service.campaigns.CampaignService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.HttpStatus.CREATED;

@RestController
@RequestMapping("/campaigns")
@RequiredArgsConstructor
public class CampaignController {

    private final CampaignService campaignService;

    @GetMapping
    public List<CampaignsResponse> getMyCampaigns() {
        return campaignService.getCampaigns();
    }

    @PostMapping
    @ResponseStatus(CREATED)
    public void create(@RequestBody CreateCampaignRequest request) {
        campaignService.createCampaign(request);
    };
}
