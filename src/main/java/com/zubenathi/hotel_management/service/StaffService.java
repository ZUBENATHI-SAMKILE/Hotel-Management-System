package com.zubenathi.hotel_management.service;

import com.zubenathi.hotel_management.entity.Staff;
import com.zubenathi.hotel_management.repository.StaffRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StaffService {

    private final StaffRepository staffRepository;

    public List<Staff> getAllStaff() {
        return staffRepository.findAll();
    }

    public Staff getStaffById(Long id) {
        return staffRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff not found"));
    }

    public List<Staff> getStaffByDepartment(Staff.Department department) {
        return staffRepository.findByDepartment(department);
    }

    public Staff createStaff(Staff staff) {
        if (staffRepository.existsByEmail(staff.getEmail())) {
            throw new RuntimeException("Staff with this email already exists.");
        }
        return staffRepository.save(staff);
    }

    public Staff updateStaff(Long id, Staff updates) {
        Staff staff = getStaffById(id);
        if (updates.getName() != null) staff.setName(updates.getName());
        if (updates.getEmail() != null) staff.setEmail(updates.getEmail());
        if (updates.getPhone() != null) staff.setPhone(updates.getPhone());
        if (updates.getDepartment() != null) staff.setDepartment(updates.getDepartment());
        if (updates.getPosition() != null) staff.setPosition(updates.getPosition());
        if (updates.getSalary() != null) staff.setSalary(updates.getSalary());
        return staffRepository.save(staff);
    }

    public Staff toggleActive(Long id) {
        Staff staff = getStaffById(id);
        staff.setActive(!staff.isActive());
        return staffRepository.save(staff);
    }

    public void deleteStaff(Long id) {
        staffRepository.deleteById(id);
    }
}