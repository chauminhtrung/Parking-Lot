package com.example.server.DTO.Respone;


import lombok.Data;

@Data
public class ParkingFloorResponse {
    private Integer floorId;
    private Integer lotId;
    private Integer floorNumber;
    private String description;
}

