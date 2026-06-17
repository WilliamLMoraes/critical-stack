package com.critical_stack.dto.campaign.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CampaignFolderListResponse {

    private Long id;
    private Long campaignId;
    private Long parentId;
    private String name;
    private int gridCount;
    private LocalDateTime createdAt;
}
