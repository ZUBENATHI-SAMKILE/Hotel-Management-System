package com.zubenathi.hotel_management.controller;

import com.zubenathi.hotel_management.entity.Staff;
import com.zubenathi.hotel_management.service.StaffService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff")
@RequiredArgsConstructor
public class StaffController {

    private final StaffService staffService;

    @GetMapping
    public ResponseEntity<List<Staff>> getAllStaff() {
        return ResponseEntity.ok(staffService.getAllStaff());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Staff> getStaff(@PathVariable Long id) {
        return ResponseEntity.ok(staffService.getStaffById(id));
    }

    @GetMapping("/department/{department}")
    public ResponseEntity<List<Staff>> getByDepartment(@PathVariable Staff.Department department) {
        return ResponseEntity.ok(staffService.getStaffByDepartment(department));
    }

    @PostMapping
    public ResponseEntity<Staff> createStaff(@RequestBody Staff staff) {
        return ResponseEntity.ok(staffService.createStaff(staff));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Staff> updateStaff(@PathVariable Long id, @RequestBody Staff updates) {
        return ResponseEntity.ok(staffService.updateStaff(id, updates));
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<Staff> toggleActive(@PathVariable Long id) {
        return ResponseEntity.ok(staffService.toggleActive(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStaff(@PathVariable Long id) {
        staffService.deleteStaff(id);
        return ResponseEntity.noContent().build();
    }
}