package com.example.server.Model;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "Invoice")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Invoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "invoiceId")
    private Integer invoiceId;

    @ManyToOne
    @JoinColumn(name = "ticketId", nullable = false)
    private Ticket ticket;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "issueDate")
    private LocalDateTime issueDate = LocalDateTime.now();

    @Column(name = "totalAmount", nullable = false)
    private Double totalAmount;
}

