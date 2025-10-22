package com.example.server.Repositories;

import com.example.server.Model.ParkingSpot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface SummaryRepository extends JpaRepository<ParkingSpot, Integer> {

    @Query("SELECT COUNT(p) FROM ParkingSpot p")
    int getTotalSpots();

    @Query("SELECT COUNT(p) FROM ParkingSpot p WHERE p.status = 'Empty'")
    int getEmptySpots();

    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.checkOutTime IS NULL")
    int getVehiclesParked();

    @Query("SELECT COALESCE(SUM(i.totalAmount), 0) FROM Invoice i WHERE CAST(i.issueDate AS DATE) = CAST(CURRENT_DATE AS DATE)")
    double getRevenueToday();
}