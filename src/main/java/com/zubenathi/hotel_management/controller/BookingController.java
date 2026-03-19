package com.zubenathi.hotel_management.controller;

import com.zubenathi.hotel_management.entity.Booking;
import com.zubenathi.hotel_management.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBooking(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    @GetMapping("/guest/{guestId}")
    public ResponseEntity<List<Booking>> getByGuest(@PathVariable Long guestId) {
        return ResponseEntity.ok(bookingService.getBookingsByGuest(guestId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Booking>> getByStatus(@PathVariable Booking.BookingStatus status) {
        return ResponseEntity.ok(bookingService.getBookingsByStatus(status));
    }

    @PostMapping("/guest/{guestId}/room/{roomId}")
    public ResponseEntity<Booking> createBooking(
            @PathVariable Long guestId,
            @PathVariable Long roomId,
            @RequestBody Booking booking) {
        return ResponseEntity.ok(bookingService.createBooking(guestId, roomId, booking));
    }

    @PatchMapping("/{id}/checkin")
    public ResponseEntity<Booking> checkIn(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.checkIn(id));
    }

    @PatchMapping("/{id}/checkout")
    public ResponseEntity<Booking> checkOut(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.checkOut(id));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<Booking> cancel(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.cancelBooking(id));
    }
}