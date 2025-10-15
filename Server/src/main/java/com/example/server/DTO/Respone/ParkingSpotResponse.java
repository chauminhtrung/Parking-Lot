package com.example.server.DTO.Respone;

import lombok.Data;



@Data
public class ParkingSpotResponse {
    private Integer spotId;
    private Integer areaId;
    private String spotCode;
    private String status; // Optional
}
