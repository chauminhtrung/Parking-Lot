package com.example.server.DTO.Request;


import lombok.Data;

@Data
public class InvoiceRequest {
    private Integer ticketId;
    private Double totalAmount;
}

