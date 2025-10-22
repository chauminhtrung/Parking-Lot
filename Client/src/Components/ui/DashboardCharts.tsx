import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import analyticsApi from "../../Api/analyticsApi";
import type { MonthlyRevenueResponse, VehicleTypeRatioResponse } from "../../Api/analyticsApi";

interface DashboardChartsProps {
  formatCurrency: (amount: number) => string;
}

export default function DashboardCharts({ formatCurrency }: DashboardChartsProps) {
  // State management
  const [monthlyData, setMonthlyData] = useState<MonthlyRevenueResponse[]>([]);
  const [vehicleData, setVehicleData] = useState<VehicleTypeRatioResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dữ liệu từ API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Call API song song để tăng tốc độ
        const [revenueData, vehicleDistribution] = await Promise.all([
          analyticsApi.getMonthlyRevenue(2025),
          analyticsApi.getVehicleDistribution()
        ]);

        // Map màu cho vehicle data
        const vehicleWithColors = vehicleDistribution.map((item) => ({
          ...item,
          color: getVehicleColor(item.name)
        }));

        setMonthlyData(revenueData);
        setVehicleData(vehicleWithColors);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Không thể kết nối tới server';
        console.error('Error fetching analytics data:', err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function: Lấy màu theo loại xe
  const getVehicleColor = (name: string): string => {
    const colorMap: Record<string, string> = {
      'Car': '#2563EB',       // Blue
      'Motorbike': '#9333EA', // Purple
      'Truck': '#16A34A',     // Green
    };
    return colorMap[name] || '#6B7280'; // Default gray
  };

  // Helper function: Translate tên xe sang tiếng Việt
  const translateVehicleName = (name: string): string => {
    const nameMap: Record<string, string> = {
      'Car': 'Ô tô',
      'Motorbike': 'Xe máy',
      'Truck': 'Xe tải',
    };
    return nameMap[name] || name;
  };

  // Loading state
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardContent className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Đang tải dữ liệu doanh thu...</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Đang tải dữ liệu xe...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-3 border-0 shadow-sm bg-red-50">
          <CardContent className="flex flex-col items-center justify-center h-96">
            <div className="text-center">
              <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-semibold text-red-700 mb-2">Không thể tải dữ liệu</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Thử lại
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Empty state
  if (monthlyData.length === 0 && vehicleData.length === 0) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-3 border-0 shadow-sm">
          <CardContent className="flex items-center justify-center h-96">
            <div className="text-center text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p>Chưa có dữ liệu thống kê</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Line Chart - Doanh thu theo tháng */}
      <Card className="lg:col-span-2 border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Doanh thu theo tháng</CardTitle>
          <p className="text-gray-600">Biểu đồ so sánh doanh thu các loại xe</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" tickFormatter={(value) => `${value / 1000000}M`} />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ borderRadius: "8px", border: "1px solid #E5E7EB" }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="car" 
                stroke="#2563EB" 
                strokeWidth={2} 
                name="Ô tô" 
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="motorbike" 
                stroke="#9333EA" 
                strokeWidth={2} 
                name="Xe máy" 
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="truck" 
                stroke="#16A34A" 
                strokeWidth={2} 
                name="Xe tải" 
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Pie Chart - Tỷ lệ loại xe */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Tỷ lệ loại xe</CardTitle>
          <p className="text-gray-600">Xe đang đỗ trong bãi</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={vehicleData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                    `${translateVehicleName(name ?? "")} ${((percent as number) * 100).toFixed(0)}%`
                  }
                outerRadius={80}
                dataKey="value"
              >
                {vehicleData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => `${value} xe`}
                labelFormatter={(name) => translateVehicleName(name)}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {vehicleData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="h-3 w-3 rounded-full" 
                    style={{ backgroundColor: item.color }} 
                  />
                  <span className="text-gray-700">
                    {translateVehicleName(item.name)}
                  </span>
                </div>
                <span className="text-gray-900 font-medium">{item.value} xe</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
