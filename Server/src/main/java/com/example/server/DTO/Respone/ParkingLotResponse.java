package com.example.server.DTO.Respone;


import lombok.Data;

@Data
public class ParkingLotResponse {
    private Integer lotId;
    private String lotName;
    private String address;
    private String accountUsername;
}


