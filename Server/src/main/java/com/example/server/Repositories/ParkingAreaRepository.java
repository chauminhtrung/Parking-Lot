package com.example.server.Repositories;


import com.example.server.Model.ParkingArea;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ParkingAreaRepository extends JpaRepository<ParkingArea, Integer> {
    List<ParkingArea> findByFloor_FloorId(Integer floorId);
}

