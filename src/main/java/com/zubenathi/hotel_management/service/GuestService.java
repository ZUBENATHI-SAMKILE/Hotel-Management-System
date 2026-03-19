package com.zubenathi.hotel_management.service;

import com.zubenathi.hotel_management.entity.Guest;
import com.zubenathi.hotel_management.repository.GuestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GuestService {

    private final GuestRepository guestRepository;

    public List<Guest> getAllGuests() {
        return guestRepository.findAll();
    }

    public Guest getGuestById(Long id) {
        return guestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Guest not found"));
    }

    public List<Guest> searchGuests(String name) {
        return guestRepository.findByNameContainingIgnoreCase(name);
    }

    public Guest createGuest(Guest guest) {
        if (guestRepository.existsByEmail(guest.getEmail())) {
            throw new RuntimeException("Guest with this email already exists.");
        }
        return guestRepository.save(guest);
    }

    public Guest updateGuest(Long id, Guest updates) {
        Guest guest = getGuestById(id);
        if (updates.getName() != null) guest.setName(updates.getName());
        if (updates.getEmail() != null) guest.setEmail(updates.getEmail());
        if (updates.getPhone() != null) guest.setPhone(updates.getPhone());
        if (updates.getAddress() != null) guest.setAddress(updates.getAddress());
        if (updates.getNationality() != null) guest.setNationality(updates.getNationality());
        if (updates.getIdNumber() != null) guest.setIdNumber(updates.getIdNumber());
        return guestRepository.save(guest);
    }

    public void deleteGuest(Long id) {
        guestRepository.deleteById(id);
    }
}