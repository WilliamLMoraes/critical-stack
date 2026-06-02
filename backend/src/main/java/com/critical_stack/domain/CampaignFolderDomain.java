package com.critical_stack.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(name = "campaigns_folders")
public class CampaignFolderDomain extends BaseDomain {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "campaign_id", nullable = false)
    private CampaignDomain campaign;

    @ManyToOne
    @JoinColumn(name = "parent_id")
    private CampaignFolderDomain parent;

    @Column(nullable = false, length = 100)
    private String name;
}
