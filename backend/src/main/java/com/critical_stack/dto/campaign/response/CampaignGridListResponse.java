package com.critical_stack.dto.campaign.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CampaignGridListResponse {

    private Long id;
    private Long folderId;
    private String name;
    private String imageBackgroundUrl;
}
