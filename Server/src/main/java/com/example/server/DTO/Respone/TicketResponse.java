package com.example.server.DTO.Respone;

import lombok.Data;

@Data
public class TicketResponse {
    private Integer ticketId;
    private String plateNumber;
    private String spotCode;
    private String employeeName;
    private String checkInTime;
    private String checkOutTime;
    private Double fee;
}

