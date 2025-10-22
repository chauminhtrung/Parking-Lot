package com.example.server.DTO;

public class SummaryStats {
    private int totalSpots;
    private int emptySpots;
    private int vehiclesParked;
    private double occupancyRate;
    private double todayRevenue;

    public SummaryStats() {}

    public SummaryStats(int totalSpots, int emptySpots, int vehiclesParked, double occupancyRate, double todayRevenue) {
        this.totalSpots = totalSpots;
        this.emptySpots = emptySpots;
        this.vehiclesParked = vehiclesParked;
        this.occupancyRate = occupancyRate;
        this.todayRevenue = todayRevenue;
    }

    // getters & setters
    public int getTotalSpots() { return totalSpots; }
    public void setTotalSpots(int totalSpots) { this.totalSpots = totalSpots; }

    public int getEmptySpots() { return emptySpots; }
    public void setEmptySpots(int emptySpots) { this.emptySpots = emptySpots; }

    public int getVehiclesParked() { return vehiclesParked; }
    public void setVehiclesParked(int vehiclesParked) { this.vehiclesParked = vehiclesParked; }

    public double getOccupancyRate() { return occupancyRate; }
    public void setOccupancyRate(double occupancyRate) { this.occupancyRate = occupancyRate; }

    public double getTodayRevenue() { return todayRevenue; }
    public void setTodayRevenue(double todayRevenue) { this.todayRevenue = todayRevenue; }
}

