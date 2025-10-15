package com.example.server.Services;


import com.example.server.DTO.Request.ParkingSpotRequest;
import com.example.server.DTO.Respone.ParkingSpotResponse;

import java.util.List;

public interface ParkingSpotService {
    ParkingSpotResponse create(ParkingSpotRequest request);
    ParkingSpotResponse update(Integer id, ParkingSpotRequest request);
    void delete(Integer id);
    List<ParkingSpotResponse> getAll();
    ParkingSpotResponse getById(Integer id);
    List<ParkingSpotResponse> getByAreaId(Integer areaId);
    ParkingSpotResponse updateStatus(Integer spotId, String status);

}
