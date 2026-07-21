package com.critical_stack.repository;

import com.critical_stack.domain.CampaignDomain;
import com.critical_stack.domain.UserDomain;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CampaignRepository extends JpaRepository<CampaignDomain, Long> {
    List<CampaignDomain> findAllByUserCreatorAndEnabled(UserDomain userCreator, Boolean enabled);

    @Query("""
        SELECT c FROM CampaignDomain c
        WHERE c.userCreator = :user AND c.enabled = true
        AND (LOWER(c.name) LIKE LOWER(CONCAT('%', :query, '%'))
             OR LOWER(c.description) LIKE LOWER(CONCAT('%', :query, '%')))
    """)
    Page<CampaignDomain> searchByUser(
        @Param("user") UserDomain user,
        @Param("query") String query,
        Pageable pageable
    );

    Page<CampaignDomain> findAllByUserCreatorAndEnabled(
        UserDomain userCreator, Boolean enabled, Pageable pageable
    );

    boolean existsByName(String name);

    boolean existsByNameAndIdNot(String name, Long id);

    Optional<CampaignDomain> findByIdAndEnabled(Long id, Boolean enabled);
}
