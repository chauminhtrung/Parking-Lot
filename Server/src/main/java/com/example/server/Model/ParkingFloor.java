package com.example.server.Model;


import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "ParkingFloor")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParkingFloor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "floorId")
    private Integer floorId;

    @ManyToOne
    @JoinColumn(name = "lotId", nullable = false)
    private ParkingLot parkingLot;

    @Column(name = "floorNumber", nullable = false)
    private Integer floorNumber;

    @Column(name = "description")
    private String description;

    @OneToMany(mappedBy = "floor", cascade = CascadeType.ALL)
    private List<ParkingArea> areas;
}
