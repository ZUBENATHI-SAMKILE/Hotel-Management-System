package com.zubenathi.hotel_management.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStats {
    private long totalRooms;
    private long availableRooms;
    private long occupiedRooms;
    private long maintenanceRooms;
    private long totalGuests;
    private long totalBookings;
    private long confirmedBookings;
    private long checkedInBookings;
    private long checkedOutBookings;
    private long cancelledBookings;
    private long totalStaff;
    private BigDecimal totalRevenue;
    private BigDecimal pendingRevenue;
}