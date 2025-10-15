package com.example.server.Model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "Vehicle")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vehicleId")
    private Integer vehicleId;

    @Column(name = "plateNumber", nullable = false, unique = true)
    private String plateNumber;

    @ManyToOne
    @JoinColumn(name = "typeId", nullable = false)
    private VehicleType type;

    @ManyToOne
    @JoinColumn(name = "customerId")
    private Customer customer;

    @OneToMany(mappedBy = "vehicle", cascade = CascadeType.ALL)
    private List<Ticket> tickets;
}
