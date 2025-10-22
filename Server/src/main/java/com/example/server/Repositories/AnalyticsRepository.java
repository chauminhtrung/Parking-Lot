package com.example.server.Repositories;

import com.example.server.Model.Invoice;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.util.List;

// ĐỔI Repository<Object, Integer> → Repository<Invoice, Integer>
public interface AnalyticsRepository extends Repository<Invoice, Integer> {

    @Query(value = """
        SELECT 
            MONTH(I.issueDate) AS monthNum,
            SUM(CASE WHEN VT.typeName = 'Car' THEN I.totalAmount ELSE 0 END) AS car,
            SUM(CASE WHEN VT.typeName = 'Motorbike' THEN I.totalAmount ELSE 0 END) AS motorbike,
            SUM(CASE WHEN VT.typeName = 'Truck' THEN I.totalAmount ELSE 0 END) AS truck
        FROM Invoice I
        JOIN Ticket T ON I.ticketId = T.ticketId
        JOIN Vehicle V ON T.vehicleId = V.vehicleId
        JOIN VehicleType VT ON V.typeId = VT.typeId
        WHERE YEAR(I.issueDate) = :year
        GROUP BY MONTH(I.issueDate)
        ORDER BY MONTH(I.issueDate)
        """, nativeQuery = true)
    List<Object[]> getMonthlyRevenueByYear(@Param("year") int year);

    @Query(value = """
        SELECT 
            VT.typeName AS typeName,
            COUNT(*) AS cnt
        FROM Ticket T
        JOIN Vehicle V ON T.vehicleId = V.vehicleId
        JOIN VehicleType VT ON V.typeId = VT.typeId
        WHERE T.checkOutTime IS NULL
        GROUP BY VT.typeName
        """, nativeQuery = true)
    List<Object[]> getActiveVehicleCountByType();
}