package com.critical_stack.repository;

import com.critical_stack.domain.CampaignDomain;
import com.critical_stack.domain.UserDomain;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CampaignRepository extends JpaRepository<CampaignDomain, Long> {
    List<CampaignDomain> findAllByUserCreatorAndEnabled(UserDomain userCreator, Boolean enabled);

    boolean existsByName(String name);

    boolean existsByNameAndIdNot(String name, Long id);

    Optional<CampaignDomain> findByIdAndEnabled(Long id, Boolean enabled);
}
