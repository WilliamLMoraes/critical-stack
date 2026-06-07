package com.critical_stack.mapper.campaign;

import com.critical_stack.domain.CampaignDomain;
import com.critical_stack.dto.campaign.response.CampaignsResponse;
import lombok.experimental.UtilityClass;

@UtilityClass
public class CampaignsMapper {

    public static CampaignsResponse toResponse(CampaignDomain response) {

        return CampaignsResponse.builder()
                .id(response.getId())
                .description(response.getDescription())
                .name(response.getName())
                .enabled(response.getEnabled())
                .urlImage(response.getUrlImage())
                .build();
    }
}
