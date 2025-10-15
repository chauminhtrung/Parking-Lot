package com.example.server.DTO.Request;


import lombok.Data;

@Data
public class TicketRequest {
    private Integer vehicleId;
    private Integer spotId;
    private Integer employeeId;
}
