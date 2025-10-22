package com.example.server.Repositories;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class SummaryRepository {

    private final JdbcTemplate jdbc;

    public SummaryRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public int getTotalSpots() {
        String sql = "SELECT COUNT(*) FROM ParkingSpot";
        Integer cnt = jdbc.queryForObject(sql, Integer.class);
        return (cnt == null) ? 0 : cnt;
    }

    public int getEmptySpots() {
        String sql = "SELECT COUNT(*) FROM ParkingSpot WHERE status = 'Empty'";
        Integer cnt = jdbc.queryForObject(sql, Integer.class);
        return (cnt == null) ? 0 : cnt;
    }

    public int getVehiclesParked() {
        String sql = "SELECT COUNT(*) FROM Ticket WHERE checkOutTime IS NULL";
        Integer cnt = jdbc.queryForObject(sql, Integer.class);
        return (cnt == null) ? 0 : cnt;
    }

    // Nếu cần doanh thu hôm nay:
    public double getRevenueToday() {
        String sql = "SELECT ISNULL(SUM(totalAmount), 0) FROM Invoice WHERE CONVERT(DATE, issueDate) = CONVERT(DATE, GETDATE())";
        Double total = jdbc.queryForObject(sql, Double.class);
        return (total == null) ? 0.0 : total;
    }
}
