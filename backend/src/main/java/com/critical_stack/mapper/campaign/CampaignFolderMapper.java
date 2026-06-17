package com.critical_stack.mapper.campaign;

import com.critical_stack.domain.CampaignDomain;
import com.critical_stack.domain.CampaignFolderDomain;
import com.critical_stack.dto.campaign.request.CreateFolderRequest;
import com.critical_stack.dto.campaign.response.CampaignFolderListResponse;
import com.critical_stack.dto.campaign.response.CampaignFolderResponse;
import com.critical_stack.dto.campaign.response.CampaignGridListResponse;
import lombok.experimental.UtilityClass;

import java.util.List;

@UtilityClass
public class CampaignFolderMapper {

    public static CampaignFolderDomain toDomain(CampaignDomain campaign, CreateFolderRequest request) {
        return CampaignFolderDomain.builder()
                .name(request.getName())
                .campaign(campaign)
                .build();
    }

    public static CampaignFolderResponse toResponse(CampaignFolderDomain domain, List<CampaignGridListResponse> grids, List<CampaignFolderListResponse> children) {
        return CampaignFolderResponse.builder()
                .id(domain.getId())
                .campaignId(domain.getCampaign().getId())
                .parentId(domain.getParent() != null ? domain.getParent().getId() : null)
                .name(domain.getName())
                .gridCount(grids.size())
                .grids(grids)
                .children(children)
                .createdAt(domain.getCreatedAt())
                .updatedAt(domain.getUpdatedAt())
                .build();
    }

    public static CampaignFolderListResponse toResponseList(CampaignFolderDomain domain, int gridCount) {
        return CampaignFolderListResponse.builder()
                .id(domain.getId())
                .campaignId(domain.getCampaign().getId())
                .parentId(domain.getParent() != null ? domain.getParent().getId() : null)
                .name(domain.getName())
                .gridCount(gridCount)
                .createdAt(domain.getCreatedAt())
                .build();
    }
}
