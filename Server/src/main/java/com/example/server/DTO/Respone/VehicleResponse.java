package com.example.server.DTO.Respone;



import lombok.Data;

@Data
public class VehicleResponse {
    private Integer vehicleId;
    private String plateNumber;
    private String vehicleType; // ✅ phải có tên này
    private String ownerName;   // ✅ phải có tên này
}


