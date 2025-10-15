package com.example.server.Services;


import com.example.server.DTO.Request.ParkingLotRequest;
import com.example.server.DTO.Respone.ParkingLotResponse;

import java.util.List;

public interface ParkingLotService {
    ParkingLotResponse create(ParkingLotRequest request);
    ParkingLotResponse update(Integer id, ParkingLotRequest request);
    void delete(Integer id);
    List<ParkingLotResponse> getAll();
    ParkingLotResponse getById(Integer id);
    List<ParkingLotResponse> getByAccountId(Integer accountId);

}

