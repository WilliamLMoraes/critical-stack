package com.critical_stack.mapper.campaign;

import com.critical_stack.domain.CampaignDomain;
import com.critical_stack.domain.UserDomain;
import com.critical_stack.dto.campaign.request.CreateCampaignRequest;
import lombok.experimental.UtilityClass;

@UtilityClass
public class CreateCampaignMapper {

    public static CampaignDomain toEntity(CreateCampaignRequest request, UserDomain userCreator) {

        return CampaignDomain.builder()
                .name(request.getName())
                .description(request.getDescription())
                .urlImage(request.getUrlImage())
                .userCreator(userCreator)
                .enabled(true)
                .build();
    }
}
