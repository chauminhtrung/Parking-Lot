package com.example.server.Model;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ParkingSpot")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParkingSpot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "spotId")
    private Integer spotId;

    @ManyToOne
    @JoinColumn(name = "areaId", nullable = false)
    private ParkingArea area;

    @Column(name = "spotCode", nullable = false)
    private String spotCode;

    @Column(name = "status", nullable = false)
    private String status = "Empty";
}

