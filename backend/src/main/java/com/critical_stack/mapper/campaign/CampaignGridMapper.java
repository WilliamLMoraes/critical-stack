package com.critical_stack.mapper.campaign;

import com.critical_stack.domain.CampaignGridDomain;
import com.critical_stack.dto.campaign.request.CampaignGridRequest;
import com.critical_stack.dto.campaign.response.CampaignGridResponse;
import lombok.experimental.UtilityClass;

@UtilityClass
public class CampaignGridMapper {

    public static CampaignGridResponse toResponse(CampaignGridDomain domain) {

        return CampaignGridResponse.builder()
                .id(domain.getId())
                .campaignId(domain.getCampaign().getId())
                .folderId(domain.getFolder() != null ? domain.getFolder().getId() : null)
                .name(domain.getName())
                .width(domain.getWidth())
                .height(domain.getHeight())
                .cellSize(domain.getCellSize())
                .lineColor(domain.getLineColor())
                .backgroundColor(domain.getBackgroundColor())
                .showGrid(domain.getShowGrid())
                .imageBackgroundUrl(domain.getImageBackgroundUrl())
                .build();
    }

    public static void merge(CampaignGridRequest request, CampaignGridDomain grid) {
        grid.setName(request.getName());
        grid.setWidth(request.getWidth());
        grid.setHeight(request.getHeight());
        grid.setCellSize(request.getCellSize());
        grid.setLineColor(request.getLineColor());
        grid.setBackgroundColor(request.getBackgroundColor());
        grid.setShowGrid(request.getShowGrid());
        grid.setImageBackgroundUrl(request.getImageBackgroundUrl());
    }
}
