package com.critical_stack.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(name = "campaigns_grid")
public class CampaignGridDomain extends BaseDomain {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "campaign_id", nullable = false)
    private CampaignDomain campaign;

    @ManyToOne
    @JoinColumn(name = "folder_id")
    private CampaignFolderDomain folder;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "width", nullable = false)
    private Integer width;

    @Column(name = "height", nullable = false)
    private Integer height;

    @Column(name = "cell_size", nullable = false)
    private Integer cellSize;

    @Column(name = "line_color", length = 9)
    private String lineColor;

    @Column(name = "background_color", length = 9)
    private String backgroundColor;

    @Column(name = "show_grid", nullable = false)
    private Boolean showGrid;

    @Column(name = "image_background_url", columnDefinition = "TEXT")
    private String imageBackgroundUrl;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "show_background_image", nullable = false)
    private Boolean showBackgroundImage;
}
