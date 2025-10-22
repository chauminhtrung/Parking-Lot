package com.example.server.Repositories;

import com.example.server.Model.Invoice;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface AnalyticsRepository extends Repository<Invoice, Integer> {

    /**
     * Lấy doanh thu theo tháng trong năm cụ thể
     * Sử dụng Ticket.checkInTime thay vì Invoice.issueDate
     */
    @Query(value = """
        SELECT 
            MONTH(T.checkInTime) AS monthNum,
            COALESCE(SUM(CASE WHEN VT.typeName = 'Car' THEN I.totalAmount ELSE 0 END), 0) AS car,
            COALESCE(SUM(CASE WHEN VT.typeName = 'Motorbike' THEN I.totalAmount ELSE 0 END), 0) AS motorbike,
            COALESCE(SUM(CASE WHEN VT.typeName = 'Truck' THEN I.totalAmount ELSE 0 END), 0) AS truck
        FROM Invoice I
        INNER JOIN Ticket T ON I.ticketId = T.ticketId
        INNER JOIN Vehicle V ON T.vehicleId = V.vehicleId
        INNER JOIN VehicleType VT ON V.typeId = VT.typeId
        WHERE YEAR(T.checkInTime) = :year
          AND T.checkInTime IS NOT NULL
        GROUP BY MONTH(T.checkInTime)
        ORDER BY MONTH(T.checkInTime)
        """, nativeQuery = true)
    List<Object[]> getMonthlyRevenueByYear(@Param("year") int year);

    /**
     * Lấy doanh thu toàn bộ thời gian
     */
    @Query(value = """
        SELECT 
            MONTH(T.checkInTime) AS monthNum,
            YEAR(T.checkInTime) AS yearNum,
            COALESCE(SUM(CASE WHEN VT.typeName = 'Car' THEN I.totalAmount ELSE 0 END), 0) AS car,
            COALESCE(SUM(CASE WHEN VT.typeName = 'Motorbike' THEN I.totalAmount ELSE 0 END), 0) AS motorbike,
            COALESCE(SUM(CASE WHEN VT.typeName = 'Truck' THEN I.totalAmount ELSE 0 END), 0) AS truck
        FROM Invoice I
        INNER JOIN Ticket T ON I.ticketId = T.ticketId
        INNER JOIN Vehicle V ON T.vehicleId = V.vehicleId
        INNER JOIN VehicleType VT ON V.typeId = VT.typeId
        WHERE T.checkInTime IS NOT NULL
        GROUP BY YEAR(T.checkInTime), MONTH(T.checkInTime)
        ORDER BY YEAR(T.checkInTime), MONTH(T.checkInTime)
        """, nativeQuery = true)
    List<Object[]> getMonthlyRevenueAllTime();

    /**
     * Lấy số lượng xe đang đỗ theo loại
     */
    @Query(value = """
        SELECT 
            VT.typeName AS typeName,
            COUNT(*) AS cnt
        FROM Ticket T
        INNER JOIN Vehicle V ON T.vehicleId = V.vehicleId
        INNER JOIN VehicleType VT ON V.typeId = VT.typeId
        WHERE T.checkOutTime IS NULL
        GROUP BY VT.typeName
        """, nativeQuery = true)
    List<Object[]> getActiveVehicleCountByType();
}