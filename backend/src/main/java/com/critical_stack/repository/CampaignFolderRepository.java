package com.critical_stack.repository;

import com.critical_stack.domain.CampaignDomain;
import com.critical_stack.domain.CampaignFolderDomain;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CampaignFolderRepository extends JpaRepository<CampaignFolderDomain, Long> {
    List<CampaignFolderDomain> findAllByCampaign(CampaignDomain campaign);
    List<CampaignFolderDomain> findAllByParent(CampaignFolderDomain parent);
}
