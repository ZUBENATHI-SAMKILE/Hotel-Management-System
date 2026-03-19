package com.zubenathi.hotel_management.controller;

import com.zubenathi.hotel_management.entity.Bill;
import com.zubenathi.hotel_management.service.BillService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bills")
@RequiredArgsConstructor
public class BillController {

    private final BillService billService;

    @GetMapping
    public ResponseEntity<List<Bill>> getAllBills() {
        return ResponseEntity.ok(billService.getAllBills());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Bill> getBill(@PathVariable Long id) {
        return ResponseEntity.ok(billService.getBillById(id));
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<Bill> getBillByBooking(@PathVariable Long bookingId) {
        return ResponseEntity.ok(billService.getBillByBooking(bookingId));
    }

    @PostMapping("/generate/{bookingId}")
    public ResponseEntity<Bill> generateBill(
            @PathVariable Long bookingId,
            @RequestBody Map<String, Object> body) {

        BigDecimal additional = body.get("additionalCharges") != null
                ? new BigDecimal(body.get("additionalCharges").toString()) : BigDecimal.ZERO;
        BigDecimal discount = body.get("discount") != null
                ? new BigDecimal(body.get("discount").toString()) : BigDecimal.ZERO;
        String notes = body.get("notes") != null ? body.get("notes").toString() : null;

        return ResponseEntity.ok(billService.generateBill(bookingId, additional, discount, notes));
    }

    @PatchMapping("/{id}/pay")
    public ResponseEntity<Bill> markAsPaid(
            @PathVariable Long id,
            @RequestParam Bill.PaymentMethod method) {
        return ResponseEntity.ok(billService.markAsPaid(id, method));
    }

    @GetMapping("/revenue")
    public ResponseEntity<Map<String, BigDecimal>> getRevenue() {
        return ResponseEntity.ok(Map.of("totalRevenue", billService.getTotalRevenue()));
    }
}