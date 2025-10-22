import React, { useState, useEffect } from "react";
import type { User } from "../../Types/User";
import { Card, CardContent } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  CalendarIcon,
  Download,
  Search,
  RefreshCw,
} from "lucide-react";
// Note: date-fns is not installed, using native Date methods instead
import ticketApi, { type TicketResponse } from "../../Api/ticketApi";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

interface ReportPageProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

interface FilterOptions {
  searchTerm: string;
  vehicleType: string;
  status: string;
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export default function ReportPage({
  user,
  setUser: _setUser,
}: ReportPageProps) {
  // Note: setUser parameter is kept for future functionality but not currently used
  void _setUser;
  const [tickets, setTickets] = useState<TicketResponse[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<TicketResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: "",
    vehicleType: "all",
    status: "all",
    dateFrom: undefined,
    dateTo: undefined,
    sortBy: "checkInTime",
    sortOrder: "desc",
  });

  // Fetch tickets data
  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await ticketApi.getAllTickets();
      setTickets(data);
      setFilteredTickets(data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      toast.error("Không thể tải dữ liệu báo cáo");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let filtered = [...tickets];

    // Search filter
    if (filters.searchTerm) {
      filtered = filtered.filter(
        (ticket) =>
          ticket.plateNumber
            .toLowerCase()
            .includes(filters.searchTerm.toLowerCase()) ||
          ticket.customerName
            ?.toLowerCase()
            .includes(filters.searchTerm.toLowerCase()) ||
          ticket.spotCode
            ?.toLowerCase()
            .includes(filters.searchTerm.toLowerCase())
      );
    }

    // Vehicle type filter
    if (filters.vehicleType !== "all") {
      filtered = filtered.filter(
        (ticket) => ticket.typeName === filters.vehicleType
      );
    }

    // Status filter
    if (filters.status !== "all") {
      if (filters.status === "active") {
        filtered = filtered.filter((ticket) => !ticket.checkOutTime);
      } else if (filters.status === "completed") {
        filtered = filtered.filter((ticket) => ticket.checkOutTime);
      }
    }

    // Date range filter
    if (filters.dateFrom) {
      filtered = filtered.filter((ticket) => {
        const checkInDate = new Date(ticket.checkInTime!);
        return checkInDate >= filters.dateFrom!;
      });
    }

    if (filters.dateTo) {
      filtered = filtered.filter((ticket) => {
        const checkInDate = new Date(ticket.checkInTime!);
        return checkInDate <= filters.dateTo!;
      });
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: string | number | Date, bValue: string | number | Date;

      switch (filters.sortBy) {
        case "checkInTime":
          aValue = new Date(a.checkInTime!);
          bValue = new Date(b.checkInTime!);
          break;
        case "plateNumber":
          aValue = a.plateNumber;
          bValue = b.plateNumber;
          break;
        case "customerName":
          aValue = a.customerName || "";
          bValue = b.customerName || "";
          break;
        case "fee":
          aValue = a.fee || 0;
          bValue = b.fee || 0;
          break;
        default:
          aValue = a.checkInTime || new Date();
          bValue = b.checkInTime || new Date();
      }

      if (filters.sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredTickets(filtered);
  }, [tickets, filters]);

  // Export to Excel
  const exportToExcel = () => {
    const headers = [
      "Mã vé",
      "Biển số xe",
      "Loại xe",
      "Khách hàng",
      "Vị trí",
      "Nhân viên",
      "Thời gian vào",
      "Thời gian ra",
      "Phí",
    ];

    const csvContent = [
      headers.join(","),
      ...filteredTickets.map((ticket) =>
        [
          ticket.ticketId || "",
          ticket.plateNumber,
          ticket.typeName || "",
          ticket.customerName || "",
          ticket.spotCode || "",
          ticket.employeeName || "",
          ticket.checkInTime
            ? new Date(ticket.checkInTime).toLocaleString("vi-VN")
            : "",
          ticket.checkOutTime
            ? new Date(ticket.checkOutTime).toLocaleString("vi-VN")
            : "",
          ticket.fee ? ticket.fee.toLocaleString("vi-VN") + " VND" : "",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `parking_report_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Xuất báo cáo thành công!");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusBadge = (ticket: TicketResponse) => {
    if (ticket.checkOutTime) {
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-700">
          Đã hoàn thành
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-orange-100 text-orange-700">
        Đang đỗ
      </Badge>
    );
  };

  const getVehicleTypeBadge = (typeName: string) => {
    const colors = {
      Car: "border-blue-200 bg-blue-50 text-blue-700",
      Motorbike: "border-purple-200 bg-purple-50 text-purple-700",
      Truck: "border-green-200 bg-green-50 text-green-700",
    };

    return (
      <Badge
        variant="outline"
        className={
          colors[typeName as keyof typeof colors] ||
          "border-gray-200 bg-gray-50 text-gray-700"
        }
      >
        {typeName}
      </Badge>
    );
  };

  return (
    <>
      {user ? (
        <div className="w-full h-full overflow-y-auto p-2">
          <main className="p-6 w-full">
           

            {/* Filters and Search */}
            <Card className="mb-6 border-0 shadow-sm">
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Tìm kiếm..."
                      value={filters.searchTerm}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          searchTerm: e.target.value,
                        }))
                      }
                      className="pl-10"
                    />
                  </div>

                  {/* Vehicle Type Filter */}
                  <Select
                    value={filters.vehicleType}
                    onValueChange={(value: string) =>
                      setFilters((prev) => ({ ...prev, vehicleType: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Loại xe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả loại xe</SelectItem>
                      <SelectItem value="Car">Ô tô</SelectItem>
                      <SelectItem value="Motorbike">Xe máy</SelectItem>
                      <SelectItem value="Truck">Xe tải</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Status Filter */}
                  <Select
                    value={filters.status}
                    onValueChange={(value: string) =>
                      setFilters((prev) => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả trạng thái</SelectItem>
                      <SelectItem value="active">Đang đỗ</SelectItem>
                      <SelectItem value="completed">Đã hoàn thành</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Sort */}
                  <Select
                    value={`${filters.sortBy}-${filters.sortOrder}`}
                    onValueChange={(value: string) => {
                      const [sortBy, sortOrder] = value.split("-");
                      setFilters((prev) => ({
                        ...prev,
                        sortBy,
                        sortOrder: sortOrder as "asc" | "desc",
                      }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sắp xếp" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="checkInTime-desc">
                        Thời gian vào (Mới nhất)
                      </SelectItem>
                      <SelectItem value="checkInTime-asc">
                        Thời gian vào (Cũ nhất)
                      </SelectItem>
                      <SelectItem value="plateNumber-asc">
                        Biển số A-Z
                      </SelectItem>
                      <SelectItem value="plateNumber-desc">
                        Biển số Z-A
                      </SelectItem>
                      <SelectItem value="customerName-asc">
                        Khách hàng A-Z
                      </SelectItem>
                      <SelectItem value="customerName-desc">
                        Khách hàng Z-A
                      </SelectItem>
                      <SelectItem value="fee-desc">Phí cao nhất</SelectItem>
                      <SelectItem value="fee-asc">Phí thấp nhất</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Range Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Từ ngày
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {filters.dateFrom
                            ? filters.dateFrom.toLocaleDateString("vi-VN")
                            : "Chọn ngày"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={filters.dateFrom}
                          onSelect={(date: Date | undefined) =>
                            setFilters((prev) => ({ ...prev, dateFrom: date }))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Đến ngày
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {filters.dateTo
                            ? filters.dateTo.toLocaleDateString("vi-VN")
                            : "Chọn ngày"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={filters.dateTo}
                          onSelect={(date: Date | undefined) =>
                            setFilters((prev) => ({ ...prev, dateTo: date }))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    onClick={exportToExcel}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Xuất Excel
                  </Button>
                  <Button
                    onClick={fetchTickets}
                    variant="outline"
                    className="flex items-center gap-2"
                    disabled={loading}
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                    />
                    Làm mới
                  </Button>
                  <Button
                    onClick={() =>
                      setFilters({
                        searchTerm: "",
                        vehicleType: "all",
                        status: "all",
                        dateFrom: undefined,
                        dateTo: undefined,
                        sortBy: "checkInTime",
                        sortOrder: "desc",
                      })
                    }
                    variant="outline"
                  >
                    Xóa bộ lọc
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Results Summary */}
            <div className="mb-4 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Hiển thị {filteredTickets.length} / {tickets.length} kết quả
              </p>
            </div>

            {/* Data Table */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-0">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="animate-spin w-6 h-6 mr-2" />
                    <span className="text-gray-600">Đang tải dữ liệu...</span>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Mã vé</TableHead>
                          <TableHead>Biển số xe</TableHead>
                          <TableHead>Loại xe</TableHead>
                          <TableHead>Khách hàng</TableHead>
                          <TableHead>Vị trí</TableHead>
                          <TableHead>Nhân viên</TableHead>
                          <TableHead>Thời gian vào</TableHead>
                          <TableHead>Thời gian ra</TableHead>
                          <TableHead>Phí</TableHead>
                          <TableHead>Trạng thái</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTickets.map((ticket) => (
                          <TableRow key={ticket.ticketId}>
                            <TableCell className="font-medium">
                              #{ticket.ticketId}
                            </TableCell>
                            <TableCell>
                              <span className="text-blue-600 font-semibold">
                                {ticket.plateNumber}
                              </span>
                            </TableCell>
                            <TableCell>
                              {getVehicleTypeBadge(ticket.typeName || "")}
                            </TableCell>
                            <TableCell>
                              {ticket.customerName || "N/A"}
                            </TableCell>
                            <TableCell>
                              <Badge >
                                {ticket.spotCode}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {ticket.employeeName || "N/A"}
                            </TableCell>
                            <TableCell className="text-gray-600">
                              {ticket.checkInTime
                                ? new Date(ticket.checkInTime).toLocaleString(
                                    "vi-VN"
                                  )
                                : "N/A"}
                            </TableCell>
                            <TableCell className="text-gray-600">
                              {ticket.checkOutTime
                                ? new Date(ticket.checkOutTime).toLocaleString(
                                    "vi-VN"
                                  )
                                : "Chưa ra"}
                            </TableCell>
                            <TableCell className="font-medium">
                              {ticket.fee
                                ? formatCurrency(ticket.fee)
                                : "Chưa tính"}
                            </TableCell>
                            <TableCell>{getStatusBadge(ticket)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </main>
        </div>
      ) : (
        <h2 className="text-xl text-gray-500">Chưa đăng nhập</h2>
      )}
    </>
  );
}
