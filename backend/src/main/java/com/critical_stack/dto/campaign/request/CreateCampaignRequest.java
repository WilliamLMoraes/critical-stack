package com.critical_stack.dto.campaign.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateCampaignRequest {

    @NotBlank(message = "O nome da Mesa é obtigatório")
    @Size(min = 3, max = 100, message = "O nome da Mesa deve ter entre 3 e 100 caracteres")
    private String name;

    @NotBlank
    @Size(max = 255, message = "A Descrição deve ter no máximo 255 caracteres")
    private String description;

    @Size(max = 512, message = "A URL da imagem de perfil deve ter no máximo 512 caracteres")
    private String urlImage;
}
