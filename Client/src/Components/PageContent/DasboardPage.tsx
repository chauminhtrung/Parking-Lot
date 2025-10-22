import React, { useEffect, useState } from "react";
import type { User } from "../../Types/User";
import { ParkingCircle, CheckCircle, Car, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import summaryApi from "../../Api/summaryApi";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Progress } from "../ui/progress";
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

interface DasboardPageProps {
  user: User | null; 
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}


// Monthly revenue data by vehicle type
const monthlyRevenueData = [
  { month: "Jan", car: 3000000, motorbike: 2500000, bicycle: 800000 },
  { month: "Feb", car: 3500000, motorbike: 2800000, bicycle: 900000 },
  { month: "Mar", car: 3200000, motorbike: 2600000, bicycle: 850000 },
  { month: "Apr", car: 4000000, motorbike: 3200000, bicycle: 1000000 },
  { month: "May", car: 3800000, motorbike: 3000000, bicycle: 950000 },
  { month: "Jun", car: 4200000, motorbike: 3400000, bicycle: 1100000 },
  { month: "Jul", car: 4500000, motorbike: 3600000, bicycle: 1200000 },
  { month: "Aug", car: 4300000, motorbike: 3500000, bicycle: 1150000 },
  { month: "Sep", car: 3900000, motorbike: 3100000, bicycle: 1000000 },
  { month: "Oct", car: 4600000, motorbike: 3700000, bicycle: 1250000 },
  { month: "Nov", car: 4800000, motorbike: 3900000, bicycle: 1300000 },
  { month: "Dec", car: 5000000, motorbike: 4000000, bicycle: 1400000 },
];

// Vehicle type distribution for pie chart
const vehicleTypeData = [
  { name: "Car", value: 15, color: "#2563EB" },
  { name: "Motorbike", value: 18, color: "#9333EA" },
  { name: "Bicycle", value: 2, color: "#16A34A" },
];

// Active tickets (currently parked vehicles)
const activeTickets = [
  {
    ticketId: 1,
    plateNumber: "51A-12345",
    typeName: "Car",
    customerName: "Nguyễn Văn A",
    spotCode: "A1",
    checkInTime: "2025-10-18 07:30:00",
    hoursParked: 3,
  },
  {
    ticketId: 2,
    plateNumber: "59X2-67890",
    typeName: "Motorbike",
    customerName: "Trần Thị B",
    spotCode: "B2",
    checkInTime: "2025-10-18 08:30:00",
    hoursParked: 2,
  },
  {
    ticketId: 3,
    plateNumber: "67B1-11111",
    typeName: "Motorbike",
    customerName: "Lê Văn C",
    spotCode: "C3",
    checkInTime: "2025-10-18 09:30:00",
    hoursParked: 1,
  },
  {
    ticketId: 4,
    plateNumber: "51B-22222",
    typeName: "Car",
    customerName: "Phạm Thị D",
    spotCode: "A2",
    checkInTime: "2025-10-18 06:00:00",
    hoursParked: 4,
  },
  {
    ticketId: 5,
    plateNumber: "59C-33333",
    typeName: "Bicycle",
    customerName: "Hoàng Văn E",
    spotCode: "D1",
    checkInTime: "2025-10-18 09:00:00",
    hoursParked: 1,
  },
];

export default function DasboardPage({ user, setUser }: DasboardPageProps) {
  const [summaryStats, setSummaryStats] = useState<SummaryStats | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await summaryApi.getSummary();
        setSummaryStats(data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu summary:", error);
      }
    };

    fetchSummary();
  }, []);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  if (!summaryStats) return <p className="p-4">Đang tải dữ liệu...</p>;

  const occupancyRate = summaryStats.occupancyRate.toFixed(0);

  return (
    <>
      {user ? (
    <div className="w-full h-full overflow-y-auto p-2">
      {/* Main Content */}
      <main className="p-6 w-full">
        {/* Summary Cards */}
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
              <p className="text-xs text-gray-500 mt-2">
                Tổng số chỗ trong bãi
              </p>
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
                value={
                  (summaryStats.emptySpots / summaryStats.totalSpots) * 100
                }
                className="h-2 bg-green-100"
              />
              <p className="text-xs text-gray-500 mt-2">
                {(
                  (summaryStats.emptySpots / summaryStats.totalSpots) *
                  100
                ).toFixed(0)}
                % còn trống
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
              <p className="text-xs text-gray-500 mt-2">
                {occupancyRate}% đang sử dụng
              </p>
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
              <p className="text-xs text-gray-500 mt-2">
                +12% so với hôm qua
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Line Chart */}
          <Card className="lg:col-span-2 border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">
                Doanh thu theo tháng
              </CardTitle>
              <p className="text-gray-600">
                Biểu đồ so sánh doanh thu các loại xe
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={monthlyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis
                    stroke="#6B7280"
                    tickFormatter={(value) => `${value / 1000000}M`}
                  />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #E5E7EB",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="car"
                    stroke="#2563EB"
                    strokeWidth={2}
                    name="Ô tô"
                    dot={{ fill: "#2563EB" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="motorbike"
                    stroke="#9333EA"
                    strokeWidth={2}
                    name="Xe máy"
                    dot={{ fill: "#9333EA" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="bicycle"
                    stroke="#16A34A"
                    strokeWidth={2}
                    name="Xe đạp"
                    dot={{ fill: "#16A34A" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Pie Chart */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Tỷ lệ loại xe</CardTitle>
              <p className="text-gray-600">Xe đang đỗ trong bãi</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={vehicleTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${((percent as number) * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {vehicleTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {vehicleTypeData.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-gray-700">{item.name}</span>
                    </div>
                    <span className="text-gray-900">{item.value} xe</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Tickets Table */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">
              Danh sách xe đang đỗ
            </CardTitle>
            <p className="text-gray-600">
              Thông tin chi tiết các xe hiện đang trong bãi
            </p>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Biển số xe</TableHead>
                  <TableHead>Loại xe</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Vị trí</TableHead>
                  <TableHead>Thời gian vào</TableHead>
                  <TableHead className="text-right">Giờ đã đỗ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeTickets.map((ticket) => (
                  <TableRow key={ticket.ticketId}>
                    <TableCell>
                      <span className="text-blue-600">
                        {ticket.plateNumber}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          ticket.typeName === "Car"
                            ? "border-blue-200 bg-blue-50 text-blue-700"
                            : ticket.typeName === "Motorbike"
                            ? "border-purple-200 bg-purple-50 text-purple-700"
                            : "border-green-200 bg-green-50 text-green-700"
                        }
                      >
                        {ticket.typeName}
                      </Badge>
                    </TableCell>
                    <TableCell>{ticket.customerName}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{ticket.spotCode}</Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {new Date(ticket.checkInTime).toLocaleString("vi-VN")}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-gray-900">
                        {ticket.hoursParked}h
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Footer Statistics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-700 mb-1">Tổng chỗ trống</p>
                  <p className="text-blue-900">
                    {summaryStats.emptySpots} / {summaryStats.totalSpots}
                  </p>
                </div>
                <CheckCircle className="h-10 w-10 text-blue-600 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-700 mb-1">Doanh thu hôm nay</p>
                  <p className="text-green-900">
                    {formatCurrency(summaryStats.todayRevenue)}
                  </p>
                </div>
                <Wallet className="h-10 w-10 text-green-600 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-700 mb-1">Xe đang đỗ (Bãi #1)</p>
                  <p className="text-orange-900">
                    {summaryStats.vehiclesParked} vehicles
                  </p>
                </div>
                <Car className="h-10 w-10 text-orange-600 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
      ) : (
        <h2 className="text-xl text-gray-500">Chưa đăng nhập</h2>
      )}
    </>

  );
}
