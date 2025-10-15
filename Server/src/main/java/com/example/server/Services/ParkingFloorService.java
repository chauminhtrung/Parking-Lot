package com.example.server.Services;


import com.example.server.DTO.Request.ParkingFloorRequest;
import com.example.server.DTO.Respone.ParkingFloorResponse;

import java.util.List;

public interface ParkingFloorService {
    ParkingFloorResponse create(ParkingFloorRequest request);
    ParkingFloorResponse update(Integer id, ParkingFloorRequest request);
    void delete(Integer id);
    List<ParkingFloorResponse> getAll();
    ParkingFloorResponse getById(Integer id);
    List<ParkingFloorResponse> getByLotId(Integer lotId);
    ParkingFloorResponse getByLotIdAndFloorNumber(Integer lotId, Integer floorNumber);


}

