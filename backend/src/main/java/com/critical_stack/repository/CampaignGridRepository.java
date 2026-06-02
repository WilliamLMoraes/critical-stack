package com.critical_stack.repository;

import com.critical_stack.domain.CampaignDomain;
import com.critical_stack.domain.CampaignFolderDomain;
import com.critical_stack.domain.CampaignGridDomain;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CampaignGridRepository extends JpaRepository<CampaignGridDomain, Long> {
    List<CampaignGridDomain> findAllByCampaign(CampaignDomain campaign);
    List<CampaignGridDomain> findAllByFolder(CampaignFolderDomain folder);
}
