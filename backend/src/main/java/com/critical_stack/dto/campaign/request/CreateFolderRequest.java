package com.critical_stack.dto.campaign.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateFolderRequest {

    @NotBlank
    @Size(max = 100)
    private String name;

    private Long parentId;
}
