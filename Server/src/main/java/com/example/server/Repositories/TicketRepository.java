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

}

