package com.zubenathi.hotel_management.service;

import com.zubenathi.hotel_management.entity.Bill;
import com.zubenathi.hotel_management.entity.Booking;
import com.zubenathi.hotel_management.repository.BillRepository;
import com.zubenathi.hotel_management.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BillService {

    private final BillRepository billRepository;
    private final BookingRepository bookingRepository;

    public List<Bill> getAllBills() {
        return billRepository.findAll();
    }

    public Bill getBillById(Long id) {
        return billRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bill not found"));
    }

    public Bill getBillByBooking(Long bookingId) {
        return billRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new RuntimeException("Bill not found for this booking"));
    }

    public Bill generateBill(Long bookingId, BigDecimal additionalCharges, BigDecimal discount, String notes) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (billRepository.findByBookingId(bookingId).isPresent()) {
            throw new RuntimeException("Bill already exists for this booking.");
        }

        BigDecimal roomCharges = booking.getTotalAmount();
        BigDecimal extra = additionalCharges != null ? additionalCharges : BigDecimal.ZERO;
        BigDecimal disc = discount != null ? discount : BigDecimal.ZERO;
        BigDecimal total = roomCharges.add(extra).subtract(disc);

        Bill bill = Bill.builder()
                .booking(booking)
                .roomCharges(roomCharges)
                .additionalCharges(extra)
                .discount(disc)
                .totalAmount(total)
                .paymentStatus(Bill.PaymentStatus.PENDING)
                .notes(notes)
                .build();

        return billRepository.save(bill);
    }

    public Bill markAsPaid(Long id, Bill.PaymentMethod method) {
        Bill bill = getBillById(id);
        bill.setPaymentStatus(Bill.PaymentStatus.PAID);
        bill.setPaymentMethod(method);
        bill.setPaidAt(LocalDateTime.now());
        return billRepository.save(bill);
    }

    public BigDecimal getTotalRevenue() {
        return billRepository.getTotalRevenue();
    }
}