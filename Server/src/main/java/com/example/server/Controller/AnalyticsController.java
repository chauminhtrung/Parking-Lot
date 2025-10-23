package com.example.server.Controller;

import com.example.server.DTO.Respone.MonthlyRevenueResponse;
import com.example.server.DTO.Respone.VehicleTypeRatioResponse;
import com.example.server.Services.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Year;
import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/monthly-revenue")
    public ResponseEntity<List<MonthlyRevenueResponse>> getMonthlyRevenue(
            @RequestParam(required = false) Integer year,
            @RequestParam int accountId
    ) {
        int targetYear = (year != null) ? year : Year.now().getValue();
        List<MonthlyRevenueResponse> data = analyticsService.getMonthlyRevenueForYear(targetYear, accountId);
        return ResponseEntity.ok(data);
    }

    @GetMapping("/vehicle-distribution")
    public ResponseEntity<List<VehicleTypeRatioResponse>> getVehicleDistribution(
            @RequestParam int accountId
    ) {
        List<VehicleTypeRatioResponse> data = analyticsService.getActiveVehicleTypeDistribution(accountId);
        return ResponseEntity.ok(data);
    }

    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Analytics API is running");
    }
}
