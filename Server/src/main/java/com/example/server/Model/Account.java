package com.example.server.Model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "Account")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "accountId")
    private Integer accountId;

    @Column(name = "username", nullable = false, unique = true)
    private String username;

    @Column(name = "passwordHash", nullable = false)
    private String passwordHash;

    @Column(name = "role", nullable = false)
    private String role = "admin";

    // Một tài khoản có thể quản lý nhiều bãi xe
    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL)
    private List<ParkingLot> parkingLots;
}
