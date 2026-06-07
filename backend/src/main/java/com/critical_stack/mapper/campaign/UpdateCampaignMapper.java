package com.critical_stack.mapper.campaign;

import com.critical_stack.domain.CampaignDomain;
import com.critical_stack.dto.campaign.request.UpdateCampaignRequest;
import lombok.experimental.UtilityClass;

@UtilityClass
public class UpdateCampaignMapper {

    public static void toEntity(UpdateCampaignRequest request, CampaignDomain campaign) {
        campaign.setName(request.getName());
        campaign.setDescription(request.getDescription());
        campaign.setUrlImage(request.getUrlImage());
    }
}
