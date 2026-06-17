package com.critical_stack.dto.campaign.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CampaignGridRequest {

    @NotBlank
    @Size(max = 100)
    private String name;

    @Min(1)
    @Max(100)
    private Integer width;

    @Min(1)
    @Max(100)
    private Integer height;

    @Min(8)
    @Max(128)
    private Integer cellSize;

    @Size(max = 9)
    private String lineColor;

    @Size(max = 9)
    private String backgroundColor;

    private Boolean showGrid;

    private String imageBackgroundUrl;

    private String description;

    private Boolean showBackgroundImage;

    private Long folderId;
}
