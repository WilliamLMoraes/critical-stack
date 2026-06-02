package com.critical_stack.repository;

import com.critical_stack.domain.UserDomain;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserDomain, Long> {
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);

    Optional<UserDomain> findByEmailAndEnabled(String email, boolean b);

    Optional<UserDomain> findByIdAndEnabled(Long id, boolean b);
}
