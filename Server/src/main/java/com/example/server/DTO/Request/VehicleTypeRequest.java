package com.example.server.DTO.Request;


import lombok.Data;

@Data
public class VehicleTypeRequest {
    private String typeName;
    private Double pricePerHour;
}

