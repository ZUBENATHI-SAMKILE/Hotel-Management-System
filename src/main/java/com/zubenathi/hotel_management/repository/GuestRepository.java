package com.zubenathi.hotel_management.repository;

import com.zubenathi.hotel_management.entity.Guest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface GuestRepository extends JpaRepository<Guest, Long> {
    Optional<Guest> findByEmail(String email);
    List<Guest> findByNameContainingIgnoreCase(String name);
    boolean existsByEmail(String email);
}