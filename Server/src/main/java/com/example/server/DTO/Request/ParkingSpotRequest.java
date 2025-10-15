package com.example.server.DTO.Request;



import lombok.Data;

@Data
public class ParkingSpotRequest {
    private Integer areaId;
    private String spotCode;
    private String status; // Optional
}
