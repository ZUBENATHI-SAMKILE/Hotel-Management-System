package com.zubenathi.hotel_management.service;

import com.zubenathi.hotel_management.entity.Booking;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    private void send(String to, String subject, String body) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(to);
        msg.setSubject(subject);
        msg.setText(body);
        mailSender.send(msg);
    }

    public void sendBookingConfirmation(Booking booking) {
        String body = String.format("""
                Dear %s,

                Your booking has been confirmed!

                Room: %s (%s)
                Check-in: %s
                Check-out: %s
                Total Amount: R%.2f

                Thank you for choosing our hotel.

                — Hotel Management Team
                """,
                booking.getGuest().getName(),
                booking.getRoom().getRoomNumber(),
                booking.getRoom().getType(),
                booking.getCheckIn(),
                booking.getCheckOut(),
                booking.getTotalAmount());

        send(booking.getGuest().getEmail(), "Booking Confirmation — Hotel Management", body);
    }

    public void sendCheckInNotification(Booking booking) {
        String body = String.format("""
                Dear %s,

                Welcome! You have been successfully checked in.

                Room: %s
                Check-out Date: %s

                Enjoy your stay!

                — Hotel Management Team
                """,
                booking.getGuest().getName(),
                booking.getRoom().getRoomNumber(),
                booking.getCheckOut());

        send(booking.getGuest().getEmail(), "Check-In Confirmation — Hotel Management", body);
    }

    public void sendCheckOutNotification(Booking booking, double totalBill) {
        String body = String.format("""
                Dear %s,

                Thank you for staying with us!

                Room: %s
                Total Bill: R%.2f

                We hope to see you again soon.

                — Hotel Management Team
                """,
                booking.getGuest().getName(),
                booking.getRoom().getRoomNumber(),
                totalBill);

        send(booking.getGuest().getEmail(), "Check-Out Summary — Hotel Management", body);
    }

    public void sendBookingCancellation(Booking booking) {
        String body = String.format("""
                Dear %s,

                Your booking for Room %s has been cancelled.

                Check-in: %s
                Check-out: %s

                If you did not request this cancellation, please contact us immediately.

                — Hotel Management Team
                """,
                booking.getGuest().getName(),
                booking.getRoom().getRoomNumber(),
                booking.getCheckIn(),
                booking.getCheckOut());

        send(booking.getGuest().getEmail(), "Booking Cancellation — Hotel Management", body);
    }
}