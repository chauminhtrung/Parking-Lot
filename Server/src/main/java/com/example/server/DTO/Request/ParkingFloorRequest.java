package com.example.server.DTO.Request;


import lombok.Data;

@Data
public class ParkingFloorRequest {
    private Integer lotId;
    private Integer floorNumber;
    private String description;
}

