package com.zubenathi.hotel_management.controller;

import com.zubenathi.hotel_management.entity.Booking;
import com.zubenathi.hotel_management.entity.Room;
import com.zubenathi.hotel_management.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final RoomRepository roomRepository;
    private final GuestRepository guestRepository;
    private final BookingRepository bookingRepository;
    private final BillRepository billRepository;
    private final StaffRepository staffRepository;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        long totalRooms = roomRepository.count();
        long availableRooms = roomRepository.findByStatus(Room.RoomStatus.AVAILABLE).size();
        long occupiedRooms = roomRepository.findByStatus(Room.RoomStatus.OCCUPIED).size();
        long totalGuests = guestRepository.count();
        long totalBookings = bookingRepository.count();
        long confirmedBookings = bookingRepository.countByStatus(Booking.BookingStatus.CONFIRMED);
        long checkedInBookings = bookingRepository.countByStatus(Booking.BookingStatus.CHECKED_IN);
        long totalStaff = staffRepository.findByActive(true).size();
        var totalRevenue = billRepository.getTotalRevenue();

        return ResponseEntity.ok(Map.of(
                "totalRooms", totalRooms,
                "availableRooms", availableRooms,
                "occupiedRooms", occupiedRooms,
                "totalGuests", totalGuests,
                "totalBookings", totalBookings,
                "confirmedBookings", confirmedBookings,
                "checkedInBookings", checkedInBookings,
                "totalStaff", totalStaff,
                "totalRevenue", totalRevenue
        ));
    }
}