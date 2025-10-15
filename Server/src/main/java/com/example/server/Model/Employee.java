package com.example.server.Model;


import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "Employee")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "employeeId")
    private Integer employeeId;

    @Column(name = "fullName", nullable = false)
    private String fullName;

    @Column(name = "position")
    private String position;

    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL)
    private List<Ticket> tickets;
}

