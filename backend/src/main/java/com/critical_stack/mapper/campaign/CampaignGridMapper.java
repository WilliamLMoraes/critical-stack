package com.critical_stack.mapper.campaign;

import com.critical_stack.domain.CampaignGridDomain;
import com.critical_stack.dto.campaign.request.CampaignGridRequest;
import com.critical_stack.dto.campaign.response.CampaignGridListResponse;
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
                .description(domain.getDescription())
                .showBackgroundImage(domain.getShowBackgroundImage())
                .build();
    }

    public static CampaignGridListResponse toResponseList(CampaignGridDomain domain) {
        return CampaignGridListResponse.builder()
                .id(domain.getId())
                .folderId(domain.getFolder() != null ? domain.getFolder().getId() : null)
                .name(domain.getName())
                .imageBackgroundUrl(domain.getImageBackgroundUrl())
                .build();
    }

    public static CampaignGridDomain toDomain(CampaignGridRequest request) {
        return CampaignGridDomain.builder()
                .name(request.getName())
                .description(request.getDescription())
                .width(request.getWidth() != null ? request.getWidth() : 20)
                .height(request.getHeight() != null ? request.getHeight() : 20)
                .cellSize(request.getCellSize() != null ? request.getCellSize() : 32)
                .lineColor(request.getLineColor() != null ? request.getLineColor() : "#cccccc")
                .backgroundColor(request.getBackgroundColor() != null ? request.getBackgroundColor() : "#1a1a1a")
                .showGrid(request.getShowGrid() != null ? request.getShowGrid() : true)
                .imageBackgroundUrl(request.getImageBackgroundUrl())
                .showBackgroundImage(request.getShowBackgroundImage() != null ? request.getShowBackgroundImage() : false)
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
        grid.setDescription(request.getDescription());
        grid.setShowBackgroundImage(request.getShowBackgroundImage());
    }
}
