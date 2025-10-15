package com.example.server.Model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "ParkingArea")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParkingArea {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "areaId")
    private Integer areaId;

    @ManyToOne
    @JoinColumn(name = "floorId", nullable = false)
    private ParkingFloor floor;

    @Column(name = "areaName", nullable = false)
    private String areaName;

    @Column(name = "description")
    private String description;

    @Column(name = "spotCount", nullable = false)
    private Integer spotCount = 0;

    @OneToMany(mappedBy = "area", cascade = CascadeType.ALL)
    private List<ParkingSpot> spots;
}
