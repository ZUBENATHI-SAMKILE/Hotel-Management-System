package com.zubenathi.hotel_management.service;

import com.zubenathi.hotel_management.entity.*;
import com.zubenathi.hotel_management.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final GuestRepository guestRepository;
    private final BillRepository billRepository;
    private final EmailService emailService;

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    public List<Booking> getBookingsByGuest(Long guestId) {
        return bookingRepository.findByGuestId(guestId);
    }

    public List<Booking> getBookingsByStatus(Booking.BookingStatus status) {
        return bookingRepository.findByStatus(status);
    }

    public Booking createBooking(Long guestId, Long roomId, Booking booking) {
        Guest guest = guestRepository.findById(guestId)
                .orElseThrow(() -> new RuntimeException("Guest not found"));
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        if (room.getStatus() != Room.RoomStatus.AVAILABLE) {
            throw new RuntimeException("Room is not available.");
        }

        List<Booking> conflicts = bookingRepository.findConflictingBookings(
                roomId, booking.getCheckIn(), booking.getCheckOut());
        if (!conflicts.isEmpty()) {
            throw new RuntimeException("Room is already booked for the selected dates.");
        }

        long nights = ChronoUnit.DAYS.between(booking.getCheckIn(), booking.getCheckOut());
        if (nights <= 0) throw new RuntimeException("Check-out must be after check-in.");

        BigDecimal total = room.getPricePerNight().multiply(BigDecimal.valueOf(nights));

        booking.setGuest(guest);
        booking.setRoom(room);
        booking.setTotalAmount(total);
        booking.setStatus(Booking.BookingStatus.CONFIRMED);

        room.setStatus(Room.RoomStatus.RESERVED);
        roomRepository.save(room);

        Booking saved = bookingRepository.save(booking);

        try { emailService.sendBookingConfirmation(saved); } catch (Exception ignored) {}

        return saved;
    }

    public Booking checkIn(Long id) {
        Booking booking = getBookingById(id);
        if (booking.getStatus() != Booking.BookingStatus.CONFIRMED) {
            throw new RuntimeException("Booking is not in CONFIRMED status.");
        }

        booking.setStatus(Booking.BookingStatus.CHECKED_IN);
        booking.getRoom().setStatus(Room.RoomStatus.OCCUPIED);
        roomRepository.save(booking.getRoom());

        Booking saved = bookingRepository.save(booking);
        try { emailService.sendCheckInNotification(saved); } catch (Exception ignored) {}
        return saved;
    }

    public Booking checkOut(Long id) {
        Booking booking = getBookingById(id);
        if (booking.getStatus() != Booking.BookingStatus.CHECKED_IN) {
            throw new RuntimeException("Booking is not in CHECKED_IN status.");
        }

        booking.setStatus(Booking.BookingStatus.CHECKED_OUT);
        booking.getRoom().setStatus(Room.RoomStatus.AVAILABLE);
        roomRepository.save(booking.getRoom());

        Booking saved = bookingRepository.save(booking);

        Bill bill = billRepository.findByBookingId(id).orElse(null);
        double total = bill != null ? bill.getTotalAmount().doubleValue() : booking.getTotalAmount().doubleValue();
        try { emailService.sendCheckOutNotification(saved, total); } catch (Exception ignored) {}

        return saved;
    }

    public Booking cancelBooking(Long id) {
        Booking booking = getBookingById(id);
        if (booking.getStatus() == Booking.BookingStatus.CHECKED_OUT) {
            throw new RuntimeException("Cannot cancel a completed booking.");
        }

        booking.setStatus(Booking.BookingStatus.CANCELLED);
        booking.getRoom().setStatus(Room.RoomStatus.AVAILABLE);
        roomRepository.save(booking.getRoom());

        Booking saved = bookingRepository.save(booking);
        try { emailService.sendBookingCancellation(saved); } catch (Exception ignored) {}
        return saved;
    }
}