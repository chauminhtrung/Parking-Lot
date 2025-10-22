package com.example.server.DTO.Respone;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyRevenueResponse {
    private String month;
    private long car;
    private long motorbike;
    private long truck;

    public long getTotalRevenue() {
        return car + motorbike + truck;
    }
}

