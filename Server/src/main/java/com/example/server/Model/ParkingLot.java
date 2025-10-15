package com.example.server.Model;


import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "ParkingLot")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParkingLot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "lotId")
    private Integer lotId;

    @ManyToOne
    @JoinColumn(name = "accountId", nullable = false)
    private Account account;

    @Column(name = "lotName", nullable = false)
    private String lotName;

    @Column(name = "address", nullable = false)
    private String address;

    @OneToMany(mappedBy = "parkingLot", cascade = CascadeType.ALL)
    private List<ParkingFloor> floors;
}


