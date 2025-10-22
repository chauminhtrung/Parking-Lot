package com.example.server.DTO.Respone;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActiveTicketResponse {
    private int ticketId;
    private String plateNumber;
    private String typeName;
    private String customerName;
    private String spotCode;
    private String checkInTime;
    private int hoursParked;
}
