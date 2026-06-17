package com.critical_stack.dto.campaign.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CampaignFolderResponse {

    private Long id;
    private Long campaignId;
    private Long parentId;
    private String name;
    private int gridCount;
    private List<CampaignGridListResponse> grids;
    private List<CampaignFolderListResponse> children;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
