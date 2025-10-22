package com.example.server.ServicesImp;

import com.example.server.DTO.SummaryStats;
import com.example.server.Repositories.SummaryRepository;
import com.example.server.Services.SummaryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.RoundingMode;
import java.text.DecimalFormat;

@Service
public class SummaryServiceImpl implements SummaryService {

    private final SummaryRepository repo;

    public SummaryServiceImpl(SummaryRepository repo) {
        this.repo = repo;
    }

    @Override
    @Transactional(readOnly = true)
    public SummaryStats getSummaryStats() {
        int total = repo.getTotalSpots();
        int empty = repo.getEmptySpots();
        int parked = repo.getVehiclesParked();
        double revenue = repo.getRevenueToday();

        double occupancyRate = 0.0;
        if (total > 0) {
            occupancyRate = ((double) parked / (double) total) * 100.0;
        }

        return new SummaryStats(total, empty, parked, occupancyRate, revenue);
    }

}
