import React from "react";
import { ParkingCircle, CheckCircle, Car, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";

interface SummaryStats {
  totalSpots: number;
  emptySpots: number;
  vehiclesParked: number;
  todayRevenue: number;
  occupancyRate: number;
}

interface DashboardSummaryCardsProps {
  summaryStats: SummaryStats;
  formatCurrency: (amount: number) => string;
}

export default function DashboardSummaryCards({
  summaryStats,
  formatCurrency,
}: DashboardSummaryCardsProps) {
  const occupancyRate = summaryStats.occupancyRate.toFixed(0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Tổng chỗ đỗ */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-gray-600">Tổng chỗ đỗ</CardTitle>
          <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <ParkingCircle className="h-5 w-5 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-gray-900 mb-2">
            {summaryStats.totalSpots} spots
          </div>
          <Progress value={100} className="h-2 bg-blue-100" />
          <p className="text-xs text-gray-500 mt-2">Tổng số chỗ trong bãi</p>
        </CardContent>
      </Card>

      {/* Chỗ đang trống */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-gray-600">Chỗ đang trống</CardTitle>
          <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-gray-900 mb-2">
            {summaryStats.emptySpots} spots
          </div>
          <Progress
            value={(summaryStats.emptySpots / summaryStats.totalSpots) * 100}
            className="h-2 bg-green-100"
          />
          <p className="text-xs text-gray-500 mt-2">
            {((summaryStats.emptySpots / summaryStats.totalSpots) * 100).toFixed(0)}% còn trống
          </p>
        </CardContent>
      </Card>

      {/* Xe đang đỗ */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-gray-600">Xe đang đỗ</CardTitle>
          <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
            <Car className="h-5 w-5 text-orange-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-gray-900 mb-2">
            {summaryStats.vehiclesParked} vehicles
          </div>
          <Progress
            value={(summaryStats.vehiclesParked / summaryStats.totalSpots) * 100}
            className="h-2 bg-orange-100"
          />
          <p className="text-xs text-gray-500 mt-2">{occupancyRate}% đang sử dụng</p>
        </CardContent>
      </Card>

      {/* Doanh thu hôm nay */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-gray-600">Doanh thu hôm nay</CardTitle>
          <div className="h-10 w-10 rounded-lg bg-yellow-100 flex items-center justify-center">
            <Wallet className="h-5 w-5 text-yellow-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-gray-900 mb-2">
            {formatCurrency(summaryStats.todayRevenue)}
          </div>
          <Progress value={60} className="h-2 bg-yellow-100" />
          <p className="text-xs text-gray-500 mt-2">+12% so với hôm qua</p>
        </CardContent>
      </Card>
    </div>
  );
}
