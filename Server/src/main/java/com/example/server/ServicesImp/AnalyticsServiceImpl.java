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
    public List<MonthlyRevenueResponse> getMonthlyRevenueForYear(int year, int accountId) {
        logger.info("📊 Fetching monthly revenue for year {} of account {}", year, accountId);

        List<Object[]> rows = analyticsRepository.getMonthlyRevenueByYear(year, accountId);
        Map<Integer, MonthlyRevenueResponse> monthMap = new LinkedHashMap<>();

        for (int m = 1; m <= 12; m++) {
            monthMap.put(m, new MonthlyRevenueResponse("Tháng " + m, 0L, 0L, 0L));
        }

        for (Object[] row : rows) {
            int month = ((Number) row[0]).intValue();
            long car = ((Number) row[1]).longValue();
            long motorbike = ((Number) row[2]).longValue();
            long truck = ((Number) row[3]).longValue();

            monthMap.put(month, new MonthlyRevenueResponse("Tháng " + month, car, motorbike, truck));
        }

        return new ArrayList<>(monthMap.values());
    }

    @Override
    @Transactional(readOnly = true)
    public List<VehicleTypeRatioResponse> getActiveVehicleTypeDistribution(int accountId) {
        logger.info("🚗 Fetching active vehicle distribution for account {}", accountId);

        List<Object[]> rows = analyticsRepository.getActiveVehicleCountByType(accountId);
        Map<String, VehicleTypeRatioResponse> map = new LinkedHashMap<>();
        map.put("Car", new VehicleTypeRatioResponse("Car", 0));
        map.put("Motorbike", new VehicleTypeRatioResponse("Motorbike", 0));
        map.put("Truck", new VehicleTypeRatioResponse("Truck", 0));

        for (Object[] row : rows) {
            String name = row[0].toString();
            long count = ((Number) row[1]).longValue();
            map.put(name, new VehicleTypeRatioResponse(name, count));
        }

        return new ArrayList<>(map.values());
    }
}
