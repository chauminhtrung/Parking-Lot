package com.example.server.Repositories;

import com.example.server.Model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnalyticsRepository extends JpaRepository<Ticket, Integer> {

    /**
     * 📊 Doanh thu theo tháng (theo năm và account cụ thể)
     */
    @Query(value = """
        SELECT 
            MONTH(T.checkOutTime) AS monthNum,
            COALESCE(SUM(CASE WHEN VT.typeName = 'Car' THEN T.fee ELSE 0 END), 0) AS car,
            COALESCE(SUM(CASE WHEN VT.typeName = 'Motorbike' THEN T.fee ELSE 0 END), 0) AS motorbike,
            COALESCE(SUM(CASE WHEN VT.typeName = 'Truck' THEN T.fee ELSE 0 END), 0) AS truck
        FROM Ticket T
        INNER JOIN Vehicle V ON T.vehicleId = V.vehicleId
        INNER JOIN VehicleType VT ON V.typeId = VT.typeId
        INNER JOIN ParkingSpot PS ON T.spotId = PS.spotId
        INNER JOIN ParkingArea PA ON PS.areaId = PA.areaId
        INNER JOIN ParkingFloor PF ON PA.floorId = PF.floorId
        INNER JOIN ParkingLot PL ON PF.lotId = PL.lotId
        WHERE YEAR(T.checkOutTime) = :year
          AND PL.accountId = :accountId
          AND T.checkOutTime IS NOT NULL
          AND T.fee IS NOT NULL
        GROUP BY MONTH(T.checkOutTime)
        ORDER BY MONTH(T.checkOutTime)
        """, nativeQuery = true)
    List<Object[]> getMonthlyRevenueByYear(
            @Param("year") int year,
            @Param("accountId") int accountId
    );

    /**
     * 📆 Toàn bộ doanh thu (mọi năm) theo account
     */
    @Query(value = """
        SELECT 
            MONTH(T.checkOutTime) AS monthNum,
            YEAR(T.checkOutTime) AS yearNum,
            COALESCE(SUM(CASE WHEN VT.typeName = 'Car' THEN T.fee ELSE 0 END), 0) AS car,
            COALESCE(SUM(CASE WHEN VT.typeName = 'Motorbike' THEN T.fee ELSE 0 END), 0) AS motorbike,
            COALESCE(SUM(CASE WHEN VT.typeName = 'Truck' THEN T.fee ELSE 0 END), 0) AS truck
        FROM Ticket T
        INNER JOIN Vehicle V ON T.vehicleId = V.vehicleId
        INNER JOIN VehicleType VT ON V.typeId = VT.typeId
        INNER JOIN ParkingSpot PS ON T.spotId = PS.spotId
        INNER JOIN ParkingArea PA ON PS.areaId = PA.areaId
        INNER JOIN ParkingFloor PF ON PA.floorId = PF.floorId
        INNER JOIN ParkingLot PL ON PF.lotId = PL.lotId
        WHERE PL.accountId = :accountId
          AND T.checkOutTime IS NOT NULL
          AND T.fee IS NOT NULL
        GROUP BY YEAR(T.checkOutTime), MONTH(T.checkOutTime)
        ORDER BY YEAR(T.checkOutTime), MONTH(T.checkOutTime)
        """, nativeQuery = true)
    List<Object[]> getMonthlyRevenueAllTime(@Param("accountId") int accountId);

    /**
     * 🚗 Phân bố loại xe đang đỗ
     */
    @Query(value = """
        SELECT 
            VT.typeName AS typeName,
            COUNT(*) AS cnt
        FROM Ticket T
        INNER JOIN Vehicle V ON T.vehicleId = V.vehicleId
        INNER JOIN VehicleType VT ON V.typeId = VT.typeId
        INNER JOIN ParkingSpot PS ON T.spotId = PS.spotId
        INNER JOIN ParkingArea PA ON PS.areaId = PA.areaId
        INNER JOIN ParkingFloor PF ON PA.floorId = PF.floorId
        INNER JOIN ParkingLot PL ON PF.lotId = PL.lotId
        WHERE T.checkOutTime IS NULL
          AND PL.accountId = :accountId
        GROUP BY VT.typeName
        """, nativeQuery = true)
    List<Object[]> getActiveVehicleCountByType(@Param("accountId") int accountId);
}