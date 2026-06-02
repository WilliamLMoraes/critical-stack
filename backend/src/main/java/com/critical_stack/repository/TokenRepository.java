package com.critical_stack.repository;

import com.critical_stack.domain.CampaignGridDomain;
import com.critical_stack.domain.TokenDomain;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TokenRepository extends JpaRepository<TokenDomain, Long> {
    List<TokenDomain> findAllByCampaignGrid(CampaignGridDomain campaignGrid);
}
