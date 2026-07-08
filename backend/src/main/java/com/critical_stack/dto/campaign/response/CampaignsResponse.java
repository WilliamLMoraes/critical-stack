package com.critical_stack.dto.campaign.response;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CampaignsResponse {

    private Long id;
    private String name;
    private String description;
    private String urlImage;
    private Boolean enabled;
    private Long rootFolderId;
    private String owner;
    private LocalDateTime createdAt;
}
