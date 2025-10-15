package com.example.server.Repositories;


import com.example.server.Model.ParkingSpot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ParkingSpotRepository extends JpaRepository<ParkingSpot, Integer> {

    List<ParkingSpot> findByArea_AreaId(Integer areaId);

    @Query("SELECT ps FROM ParkingSpot ps WHERE ps.status = 'Empty'")
    List<ParkingSpot> findAllAvailableSpots();

    @Query("SELECT COUNT(ps) FROM ParkingSpot ps WHERE ps.status = 'Occupied'")
    long countOccupiedSpots();




}

