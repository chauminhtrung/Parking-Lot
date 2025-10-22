package com.example.server.ServicesImp;

import com.example.server.DTO.Respone.MonthlyRevenueResponse;
import com.example.server.DTO.Respone.VehicleTypeRatioResponse;
import com.example.server.Repositories.AnalyticsRepository;
import com.example.server.Services.AnalyticsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class AnalyticsServiceImpl implements AnalyticsService {

    private static final Logger logger = LoggerFactory.getLogger(AnalyticsServiceImpl.class);
    private final AnalyticsRepository analyticsRepository;

    public AnalyticsServiceImpl(AnalyticsRepository analyticsRepository) {
        this.analyticsRepository = analyticsRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<MonthlyRevenueResponse> getMonthlyRevenueForYear(int year) {
        logger.info("📊 Fetching monthly revenue for year: {}", year);

        List<Object[]> rows = analyticsRepository.getMonthlyRevenueByYear(year);
        logger.info("✅ Found {} months with data", rows.size());

        // Log raw data để debug
        for (Object[] row : rows) {
            logger.debug("Month: {}, Car: {}, Motorbike: {}, Truck: {}",
                    row[0], row[1], row[2], row[3]);
        }

        // Khởi tạo 12 tháng với giá trị 0
        Map<Integer, MonthlyRevenueResponse> monthMap = new LinkedHashMap<>();
        for (int m = 1; m <= 12; m++) {
            monthMap.put(m, new MonthlyRevenueResponse("Tháng " + m, 0L, 0L, 0L));
        }

        // Fill dữ liệu thực tế
        for (Object[] row : rows) {
            Integer monthNum = ((Number) row[0]).intValue();
            long car = row[1] == null ? 0L : ((Number) row[1]).longValue();
            long motorbike = row[2] == null ? 0L : ((Number) row[2]).longValue();
            long truck = row[3] == null ? 0L : ((Number) row[3]).longValue();

            monthMap.put(monthNum, new MonthlyRevenueResponse("Tháng " + monthNum, car, motorbike, truck));
        }

        List<MonthlyRevenueResponse> result = new ArrayList<>(monthMap.values());
        logger.info("📦 Returning {} months of data", result.size());

        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public List<VehicleTypeRatioResponse> getActiveVehicleTypeDistribution() {
        logger.info("🚗 Fetching vehicle distribution");

        List<Object[]> rows = analyticsRepository.getActiveVehicleCountByType();
        logger.info("✅ Found {} vehicle types", rows.size());

        Map<String, VehicleTypeRatioResponse> typeMap = new LinkedHashMap<>();
        typeMap.put("Car", new VehicleTypeRatioResponse("Car", 0L));
        typeMap.put("Motorbike", new VehicleTypeRatioResponse("Motorbike", 0L));
        typeMap.put("Truck", new VehicleTypeRatioResponse("Truck", 0L));

        for (Object[] row : rows) {
            String typeName = row[0] == null ? "Unknown" : row[0].toString();
            long count = row[1] == null ? 0L : ((Number) row[1]).longValue();

            logger.debug("Type: {}, Count: {}", typeName, count);

            if (typeMap.containsKey(typeName)) {
                typeMap.put(typeName, new VehicleTypeRatioResponse(typeName, count));
            }
        }

        return new ArrayList<>(typeMap.values());
    }
}