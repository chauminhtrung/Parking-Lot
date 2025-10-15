package com.example.server.Repositories;


import com.example.server.Model.ParkingFloor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ParkingFloorRepository extends JpaRepository<ParkingFloor, Integer> {

    List<ParkingFloor> findByParkingLot_LotId(Integer lotId);

    Optional<ParkingFloor> findByParkingLot_LotIdAndFloorNumber(Integer lotId, Integer floorNumber);

}


