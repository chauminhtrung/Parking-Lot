package com.example.server.DTO.Respone;


import lombok.Data;

@Data
public class InvoiceResponse {
    private Integer invoiceId;
    private Integer ticketId;
    private String issueDate;
    private Double totalAmount;
}

