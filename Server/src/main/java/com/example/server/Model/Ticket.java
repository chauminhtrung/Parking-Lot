package com.example.server.Model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "Ticket")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ticketId")
    private Integer ticketId;

    @ManyToOne
    @JoinColumn(name = "vehicleId", nullable = false)
    private Vehicle vehicle;

    @ManyToOne
    @JoinColumn(name = "spotId", nullable = false)
    private ParkingSpot spot;

    @ManyToOne
    @JoinColumn(name = "employeeId", nullable = false)
    private Employee employee;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "checkInTime")
    private LocalDateTime checkInTime = LocalDateTime.now();

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "checkOutTime")
    private LocalDateTime checkOutTime;

    @Column(name = "fee")
    private Double fee;
}

