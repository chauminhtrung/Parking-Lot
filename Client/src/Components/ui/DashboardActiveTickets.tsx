import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { CheckCircle, Car, Wallet } from "lucide-react";

interface SummaryStats {
  totalSpots: number;
  emptySpots: number;
  vehiclesParked: number;
  todayRevenue: number;
}

interface DashboardActiveTicketsProps {
  summaryStats: SummaryStats;
  formatCurrency: (amount: number) => string;
}

const activeTickets = [
  { ticketId: 1, plateNumber: "51A-12345", typeName: "Car", customerName: "Nguyễn Văn A", spotCode: "A1", checkInTime: "2025-10-18 07:30:00", hoursParked: 3 },
  { ticketId: 2, plateNumber: "59X2-67890", typeName: "Motorbike", customerName: "Trần Thị B", spotCode: "B2", checkInTime: "2025-10-18 08:30:00", hoursParked: 2 },
  { ticketId: 3, plateNumber: "67B1-11111", typeName: "Motorbike", customerName: "Lê Văn C", spotCode: "C3", checkInTime: "2025-10-18 09:30:00", hoursParked: 1 },
  { ticketId: 4, plateNumber: "51B-22222", typeName: "Car", customerName: "Phạm Thị D", spotCode: "A2", checkInTime: "2025-10-18 06:00:00", hoursParked: 4 },
  { ticketId: 5, plateNumber: "59C-33333", typeName: "Bicycle", customerName: "Hoàng Văn E", spotCode: "D1", checkInTime: "2025-10-18 09:00:00", hoursParked: 1 },
];

export default function DashboardActiveTickets({ summaryStats, formatCurrency }: DashboardActiveTicketsProps) {
  return (
    <>
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Danh sách xe đang đỗ</CardTitle>
          <p className="text-gray-600">Thông tin chi tiết các xe hiện đang trong bãi</p>
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
                    <span className="text-blue-600">{ticket.plateNumber}</span>
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
                    <span className="text-gray-900">{ticket.hoursParked}h</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Footer Cards */}
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
                <p className="text-green-900">{formatCurrency(summaryStats.todayRevenue)}</p>
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
                <p className="text-orange-900">{summaryStats.vehiclesParked} vehicles</p>
              </div>
              <Car className="h-10 w-10 text-orange-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
