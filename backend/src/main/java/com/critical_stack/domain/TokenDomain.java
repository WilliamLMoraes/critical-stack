package com.critical_stack.domain;

import com.critical_stack.enumerated.TokenEnum;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(name = "tokens")
public class TokenDomain extends BaseDomain {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "campaign_grid_id", nullable = false)
    private CampaignGridDomain campaignGrid;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TokenEnum type;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String imageUrl;

    @Column(nullable = false)
    private Float rotation;

    @Column(length = 9)
    private String tintColor;

    @Column(name = "pos_x", nullable = false)
    private Integer posX;

    @Column(name = "pos_y", nullable = false)
    private Integer posY;

    @Column(name = "width", nullable = false)
    private Integer width;

    @Column(name = "height", nullable = false)
    private Integer height;

    @Column(name = "hp_current")
    private Integer hpCurrent;

    @Column(name = "hp_max")
    private Integer hpMax;

    @Column(name = "is_visible_to_players", nullable = false)
    private Boolean isVisibleToPlayers;
}
