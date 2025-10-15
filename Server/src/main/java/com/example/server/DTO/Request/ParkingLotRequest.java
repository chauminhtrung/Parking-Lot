package com.example.server.DTO.Request;


import lombok.Data;

@Data
public class ParkingLotRequest {
    private String lotName;
    private String address;
    private Integer accountId;
}

