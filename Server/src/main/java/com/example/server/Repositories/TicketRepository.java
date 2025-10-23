package com.example.server.Repositories;



import com.example.server.Model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface TicketRepository extends JpaRepository<Ticket, Integer> {

    @Query("SELECT t FROM Ticket t WHERE t.checkOutTime IS NULL")
    List<Ticket> findActiveTickets();

    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.checkOutTime IS NULL")
    long countActiveTickets();

    List<Ticket> findByVehicle_VehicleId(Integer vehicleId);

    Optional<Ticket> findFirstBySpot_SpotIdAndCheckOutTimeIsNull(Integer spotId);

    @Query(value = """
    SELECT 
        T.ticketId,
        V.plateNumber,
        VT.typeName,
        C.fullName AS customerName,
        PS.spotCode,
        FORMAT(T.checkInTime, 'yyyy-MM-dd HH:mm:ss') AS checkInTime,
        DATEDIFF(HOUR, T.checkInTime, GETDATE()) AS hoursParked
    FROM Ticket T
    JOIN Vehicle V ON T.vehicleId = V.vehicleId
    JOIN VehicleType VT ON V.typeId = VT.typeId
    JOIN Customer C ON V.customerId = C.customerId
    JOIN ParkingSpot PS ON T.spotId = PS.spotId
    JOIN ParkingArea PA ON PS.areaId = PA.areaId
    JOIN ParkingFloor PF ON PA.floorId = PF.floorId
    JOIN ParkingLot PL ON PF.lotId = PL.lotId
    WHERE T.checkOutTime IS NULL
      AND PL.accountId = :accountId
    ORDER BY T.checkInTime
    """, nativeQuery = true)
    List<Object[]> getActiveTicketsByAccount(@org.springframework.data.repository.query.Param("accountId") Integer accountId);


    @Query(value = """
    SELECT 
        T.ticketId,
        V.plateNumber,
        VT.typeName,
        C.fullName AS customerName,
        PS.spotCode,
        E.fullName AS employeeName,
        FORMAT(T.checkInTime, 'yyyy-MM-dd HH:mm:ss') AS checkInTime,
        FORMAT(T.checkOutTime, 'yyyy-MM-dd HH:mm:ss') AS checkOutTime,
        ISNULL(T.fee, 0) AS fee
    FROM Ticket T
    JOIN Vehicle V ON T.vehicleId = V.vehicleId
    JOIN VehicleType VT ON V.typeId = VT.typeId
    JOIN Customer C ON V.customerId = C.customerId
    JOIN ParkingSpot PS ON T.spotId = PS.spotId
    JOIN ParkingArea PA ON PS.areaId = PA.areaId
    JOIN ParkingFloor PF ON PA.floorId = PF.floorId
    JOIN ParkingLot PL ON PF.lotId = PL.lotId
    LEFT JOIN Employee E ON T.employeeId = E.employeeId
    WHERE PL.accountId = :accountId
    ORDER BY T.checkInTime DESC
    """, nativeQuery = true)
    List<Object[]> getTicketsByAccount(@org.springframework.data.repository.query.Param("accountId") Integer accountId);

}

