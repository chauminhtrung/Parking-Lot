package com.example.server.Services;


import com.example.server.DTO.Request.ParkingAreaRequest;
import com.example.server.DTO.Respone.ParkingAreaResponse;

import java.util.List;

public interface ParkingAreaService {
    ParkingAreaResponse create(ParkingAreaRequest request);
    ParkingAreaResponse update(Integer id, ParkingAreaRequest request);
    void delete(Integer id);
    List<ParkingAreaResponse> getAll();
    ParkingAreaResponse getById(Integer id);
    // 🆕 Thêm hàm mới: Lấy khu vực theo floorId
    List<ParkingAreaResponse> getByFloorId(Integer floorId);
}

