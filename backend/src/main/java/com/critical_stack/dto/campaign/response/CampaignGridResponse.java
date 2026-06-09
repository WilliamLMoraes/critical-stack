package com.critical_stack.dto.campaign.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CampaignGridResponse {

    private Long id;
    private Long campaignId;
    private Long folderId;
    private String name;
    private Integer width;
    private Integer height;
    private Integer cellSize;
    private String lineColor;
    private String backgroundColor;
    private Boolean showGrid;
    private String imageBackgroundUrl;
}
