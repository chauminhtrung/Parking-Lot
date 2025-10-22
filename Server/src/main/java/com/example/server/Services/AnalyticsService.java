package com.example.server.Services;

import com.example.server.DTO.Respone.MonthlyRevenueResponse;
import com.example.server.DTO.Respone.VehicleTypeRatioResponse;
import java.util.List;

public interface AnalyticsService {

    List<MonthlyRevenueResponse> getMonthlyRevenueForYear(int year);
    List<VehicleTypeRatioResponse> getActiveVehicleTypeDistribution();
}