package com.zubenathi.hotel_management.repository;

import com.zubenathi.hotel_management.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StaffRepository extends JpaRepository<Staff, Long> {
    List<Staff> findByDepartment(Staff.Department department);
    List<Staff> findByActive(boolean active);
    boolean existsByEmail(String email);
}