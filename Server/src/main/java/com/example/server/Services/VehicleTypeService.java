package com.example.server.Services;



import com.example.server.DTO.Request.VehicleTypeRequest;
import com.example.server.DTO.Respone.VehicleTypeResponse;

import java.util.List;

public interface VehicleTypeService {
    VehicleTypeResponse create(VehicleTypeRequest request);
    VehicleTypeResponse update(Integer id, VehicleTypeRequest request);
    void delete(Integer id);
    List<VehicleTypeResponse> getAll();
    VehicleTypeResponse getById(Integer id);
}

