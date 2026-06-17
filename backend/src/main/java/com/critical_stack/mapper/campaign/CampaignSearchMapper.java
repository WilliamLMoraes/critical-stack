package com.critical_stack.mapper.campaign;

import com.critical_stack.dto.campaign.response.CampaignFolderListResponse;
import com.critical_stack.dto.campaign.response.CampaignGridListResponse;
import com.critical_stack.dto.campaign.response.CampaignSearchResponse;
import lombok.experimental.UtilityClass;

import java.util.List;

@UtilityClass
public class CampaignSearchMapper {

    public static CampaignSearchResponse toResponse(List<CampaignFolderListResponse> folders, List<CampaignGridListResponse> grids) {
        return CampaignSearchResponse.builder()
                .folders(folders)
                .grids(grids)
                .build();
    }
}
