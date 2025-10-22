import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { CheckCircle, Car, Wallet } from "lucide-react";
import ticketApi, { type TicketResponse } from "../../Api/ticketApi";

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

export default function DashboardActiveTickets({
  summaryStats,
  formatCurrency,
}: DashboardActiveTicketsProps) {
  const [activeTickets, setActiveTickets] = useState<TicketResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveTickets = async () => {
      try {
        const data = await ticketApi.getActiveTickets();
        setActiveTickets(data);
      } catch (error) {
        console.error("Lỗi khi tải vé đang hoạt động:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchActiveTickets();
  }, []);

  return (
    <>
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Danh sách xe đang đỗ</CardTitle>
          <p className="text-gray-600">Thông tin chi tiết các xe hiện đang trong bãi</p>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-gray-500 text-center py-6">Đang tải dữ liệu...</p>
          ) : activeTickets.length === 0 ? (
            <p className="text-gray-500 text-center py-6">Không có xe nào đang đỗ</p>
          ) : (
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
                {activeTickets.map((ticket) => {
                  const hoursParked = ticket.checkInTime
                    ? Math.floor(
                        (Date.now() - new Date(ticket.checkInTime).getTime()) / (1000 * 60 * 60)
                      )
                    : 0;
                  return (
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
                          {ticket.typeName || "Khác"}
                        </Badge>
                      </TableCell>
                      <TableCell>{ticket.customerName || "-"}</TableCell>
                      <TableCell>
                        <Badge>{ticket.spotCode || "-"}</Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {ticket.checkInTime
                          ? new Date(ticket.checkInTime).toLocaleString("vi-VN")
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-gray-900">{hoursParked}h</span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
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
