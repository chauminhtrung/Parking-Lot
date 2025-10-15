package com.example.server.DTO.Respone;


import lombok.Data;

@Data
public class VehicleTypeResponse {
    private Integer typeId;
    private String typeName;
    private Double pricePerHour;
}

