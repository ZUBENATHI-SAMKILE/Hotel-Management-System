package com.zubenathi.hotel_management.service;

import com.zubenathi.hotel_management.entity.Room;
import com.zubenathi.hotel_management.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public Room getRoomById(Long id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));
    }

    public List<Room> getAvailableRooms() {
        return roomRepository.findByStatus(Room.RoomStatus.AVAILABLE);
    }

    public List<Room> getRoomsByType(Room.RoomType type) {
        return roomRepository.findByType(type);
    }

    public Room createRoom(Room room) {
        if (roomRepository.existsByRoomNumber(room.getRoomNumber())) {
            throw new RuntimeException("Room number already exists.");
        }
        return roomRepository.save(room);
    }

    public Room updateRoom(Long id, Room updates) {
        Room room = getRoomById(id);
        if (updates.getRoomNumber() != null) room.setRoomNumber(updates.getRoomNumber());
        if (updates.getType() != null) room.setType(updates.getType());
        if (updates.getStatus() != null) room.setStatus(updates.getStatus());
        if (updates.getPricePerNight() != null) room.setPricePerNight(updates.getPricePerNight());
        if (updates.getFloor() != null) room.setFloor(updates.getFloor());
        if (updates.getCapacity() != null) room.setCapacity(updates.getCapacity());
        if (updates.getDescription() != null) room.setDescription(updates.getDescription());
        if (updates.getAmenities() != null) room.setAmenities(updates.getAmenities());
        return roomRepository.save(room);
    }

    public void deleteRoom(Long id) {
        roomRepository.deleteById(id);
    }

    public Room updateStatus(Long id, Room.RoomStatus status) {
        Room room = getRoomById(id);
        room.setStatus(status);
        return roomRepository.save(room);
    }
}