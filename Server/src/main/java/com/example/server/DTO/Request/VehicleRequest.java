package com.example.server.DTO.Request;


import lombok.Data;

@Data
public class VehicleRequest {
    private String plateNumber;
    private Integer typeId;
    private Integer customerId;
}

