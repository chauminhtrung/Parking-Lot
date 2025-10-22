package com.example.server.ServicesImp;

import com.example.server.DTO.SummaryStats;
import com.example.server.Repositories.SummaryRepository;
import com.example.server.Services.SummaryService;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.AccessLevel;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SummaryServiceImpl implements SummaryService {

    SummaryRepository repo;

    @Override
    @Transactional(readOnly = true)
    public SummaryStats getSummaryStats() {
        int total = repo.getTotalSpots();
        int empty = repo.getEmptySpots();
        int parked = repo.getVehiclesParked();
        double revenue = repo.getRevenueToday();

        double occupancyRate = (total > 0)
                ? ((double) parked / total) * 100.0
                : 0.0;

        return new SummaryStats(total, empty, parked, occupancyRate, revenue);
    }
}
