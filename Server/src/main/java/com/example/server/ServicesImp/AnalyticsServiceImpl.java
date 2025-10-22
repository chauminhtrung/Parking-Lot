package com.example.server.ServicesImp;

import com.example.server.DTO.Respone.MonthlyRevenueResponse;
import com.example.server.DTO.Respone.VehicleTypeRatioResponse;
import com.example.server.Repositories.AnalyticsRepository;
import com.example.server.Services.AnalyticsService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.DateFormatSymbols;
import java.util.*;

@Service
public class AnalyticsServiceImpl implements AnalyticsService {

    private final AnalyticsRepository analyticsRepository;

    public AnalyticsServiceImpl(AnalyticsRepository analyticsRepository) {
        this.analyticsRepository = analyticsRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<MonthlyRevenueResponse> getMonthlyRevenueForYear(int year) {
        List<Object[]> rows = analyticsRepository.getMonthlyRevenueByYear(year);
        Map<Integer, MonthlyRevenueResponse> monthMap = new LinkedHashMap<>();
        String[] monthNames = new DateFormatSymbols(Locale.forLanguageTag("vi")).getMonths();

        for (int m = 1; m <= 12; m++) {
            String monthName = "Tháng " + m; // Hoặc dùng monthNames[m-1] cho tên đầy đủ
            monthMap.put(m, new MonthlyRevenueResponse(monthName, 0L, 0L, 0L));
        }

        for (Object[] row : rows) {
            Integer monthNum = ((Number) row[0]).intValue();
            long car = row[1] == null ? 0L : ((Number) row[1]).longValue();
            long motorbike = row[2] == null ? 0L : ((Number) row[2]).longValue();
            long truck = row[3] == null ? 0L : ((Number) row[3]).longValue();

            String monthName = "Tháng " + monthNum;
            monthMap.put(monthNum, new MonthlyRevenueResponse(monthName, car, motorbike, truck));
        }
        return new ArrayList<>(monthMap.values());
    }

    @Override
    @Transactional(readOnly = true)
    public List<VehicleTypeRatioResponse> getActiveVehicleTypeDistribution() {
        List<Object[]> rows = analyticsRepository.getActiveVehicleCountByType();
        Map<String, VehicleTypeRatioResponse> typeMap = new LinkedHashMap<>();
        typeMap.put("Car", new VehicleTypeRatioResponse("Car", 0L));
        typeMap.put("Motorbike", new VehicleTypeRatioResponse("Motorbike", 0L));
        typeMap.put("Truck", new VehicleTypeRatioResponse("Truck", 0L));

        for (Object[] row : rows) {
            String typeName = row[0] == null ? "Unknown" : row[0].toString();
            long count = row[1] == null ? 0L : ((Number) row[1]).longValue();

            if (typeMap.containsKey(typeName)) {
                typeMap.put(typeName, new VehicleTypeRatioResponse(typeName, count));
            }
        }

        return new ArrayList<>(typeMap.values());
    }
}