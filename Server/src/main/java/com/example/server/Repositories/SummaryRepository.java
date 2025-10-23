package com.example.server.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.example.server.Model.ParkingSpot;

@Repository
public interface SummaryRepository extends JpaRepository<ParkingSpot, Integer> {

    // 1. Tổng chỗ đỗ
    @Query(value = """
        SELECT COUNT(ps.spotId)
        FROM ParkingSpot ps
        JOIN ParkingArea pa ON ps.areaId = pa.areaId
        JOIN ParkingFloor pf ON pa.floorId = pf.floorId
        JOIN ParkingLot pl ON pf.lotId = pl.lotId
        WHERE pl.accountId = :accountId
        """, nativeQuery = true)
    int getTotalSpots(int accountId);

    // 2. Chỗ trống
    @Query(value = """
        SELECT COUNT(ps.spotId)
        FROM ParkingSpot ps
        JOIN ParkingArea pa ON ps.areaId = pa.areaId
        JOIN ParkingFloor pf ON pa.floorId = pf.floorId
        JOIN ParkingLot pl ON pf.lotId = pl.lotId
        WHERE ps.status = 'Empty' AND pl.accountId = :accountId
        """, nativeQuery = true)
    int getEmptySpots(int accountId);

    // 3. Xe đang đỗ
    @Query(value = """
        SELECT COUNT(t.ticketId)
        FROM Ticket t
        JOIN ParkingSpot ps ON t.spotId = ps.spotId
        JOIN ParkingArea pa ON ps.areaId = pa.areaId
        JOIN ParkingFloor pf ON pa.floorId = pf.floorId
        JOIN ParkingLot pl ON pf.lotId = pl.lotId
        WHERE t.checkOutTime IS NULL AND pl.accountId = :accountId
        """, nativeQuery = true)
    int getVehiclesParked(int accountId);

    // 4. Doanh thu hôm nay
    // 4. Doanh thu hôm nay theo accountId (tính từ Ticket.fee)
    @Query(value = """
    SELECT COALESCE(SUM(t.fee), 0)
    FROM Ticket t
    INNER JOIN ParkingSpot ps ON t.spotId = ps.spotId
    INNER JOIN ParkingArea pa ON ps.areaId = pa.areaId
    INNER JOIN ParkingFloor pf ON pa.floorId = pf.floorId
    INNER JOIN ParkingLot pl ON pf.lotId = pl.lotId
    WHERE CONVERT(DATE, t.checkOutTime) = CONVERT(DATE, GETDATE())
      AND t.checkOutTime IS NOT NULL
      AND t.fee IS NOT NULL
      AND pl.accountId = :accountId
    """, nativeQuery = true)
    double getRevenueToday(int accountId);

}
