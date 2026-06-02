package com.critical_stack.repository;

import com.critical_stack.domain.CampaignDomain;
import com.critical_stack.domain.UserDomain;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CampaignRepository extends JpaRepository<CampaignDomain, Long> {
    List<CampaignDomain> findAllByUserCreator(UserDomain userCreator);

    boolean existsByName(String name);
}
