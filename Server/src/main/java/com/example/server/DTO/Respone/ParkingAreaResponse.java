package com.example.server.DTO.Respone;


import lombok.Data;

@Data
public class ParkingAreaResponse {
    private Integer areaId;
    private Integer floorId;
    private String areaName;
    private String description;
    private Integer spotCount;
}

