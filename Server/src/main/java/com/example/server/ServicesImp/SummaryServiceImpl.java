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
    public SummaryStats getSummaryStats(int accountId) {
        int total = repo.getTotalSpots(accountId);
        int empty = repo.getEmptySpots(accountId);
        int parked = repo.getVehiclesParked(accountId);
        double revenue = repo.getRevenueToday(accountId);

        double occupancyRate = (total > 0)
                ? ((double) parked / total) * 100.0
                : 0.0;

        return new SummaryStats(total, empty, parked, occupancyRate, revenue);
    }
}
