package com.example.server.DTO.Request;


import lombok.Data;

@Data
public class ParkingAreaRequest {
    private Integer floorId;
    private String areaName;
    private String description;
    private Integer spotCount;
}

