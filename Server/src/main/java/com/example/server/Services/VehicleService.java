package com.example.server.Services;


import com.example.server.DTO.Request.VehicleRequest;
import com.example.server.DTO.Respone.VehicleResponse;

import java.util.List;

public interface VehicleService {
    VehicleResponse create(VehicleRequest request);
    VehicleResponse update(Integer id, VehicleRequest request);
    void delete(Integer id);
    List<VehicleResponse> getAll();
    VehicleResponse getById(Integer id);
    VehicleResponse getByPlate(String plate);
}

