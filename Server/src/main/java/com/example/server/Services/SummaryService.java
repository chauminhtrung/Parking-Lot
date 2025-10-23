package com.example.server.Services;

import com.example.server.DTO.SummaryStats;

public interface SummaryService {
    SummaryStats getSummaryStats(int accountId);
}
