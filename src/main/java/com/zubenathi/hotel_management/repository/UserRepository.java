// ── UserRepository.java ──────────────────────────────────────
package com.zubenathi.hotel_management.repository;

import com.zubenathi.hotel_management.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}