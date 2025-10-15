package com.example.server.Model;


import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "VehicleType")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehicleType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "typeId")
    private Integer typeId;

    @Column(name = "typeName", nullable = false)
    private String typeName;

    @Column(name = "pricePerHour", nullable = false)
    private Double pricePerHour;

    @OneToMany(mappedBy = "type", cascade = CascadeType.ALL)
    private List<Vehicle> vehicles;
}

