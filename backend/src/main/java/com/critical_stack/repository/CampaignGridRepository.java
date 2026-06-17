package com.critical_stack.repository;

import com.critical_stack.domain.CampaignDomain;
import com.critical_stack.domain.CampaignFolderDomain;
import com.critical_stack.domain.CampaignGridDomain;
import com.critical_stack.domain.UserDomain;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CampaignGridRepository extends JpaRepository<CampaignGridDomain, Long> {
    List<CampaignGridDomain> findAllByCampaign(CampaignDomain campaign);
    List<CampaignGridDomain> findAllByFolder(CampaignFolderDomain folder);
    boolean existsByFolderAndName(CampaignFolderDomain folder, String name);

    Optional<CampaignGridDomain> findFirstByCampaignOrderByUpdatedAtDesc(CampaignDomain campaign);
}
