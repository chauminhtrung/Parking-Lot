import React, { useEffect, useState } from "react";
import type { User } from "../../Types/User";
import summaryApi, { type SummaryStats } from "../../Api/summaryApi";
import DashboardSummaryCards from "../ui/DashboardSummaryCards";
import DashboardCharts from "../ui/DashboardCharts";
import DashboardActiveTickets from "../ui/DashboardActiveTickets";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

interface DashboardPageProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export default function DashboardPage({ user: _user }: DashboardPageProps) {
  // Note: user parameter is kept for future functionality but not currently used
  void _user;
  const [summaryStats, setSummaryStats] = useState<SummaryStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Định dạng tiền VND
  const formatCurrency = (amount: number): string =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        setError(null);

        // ✅ summaryApi.getSummary() đã trả về trực tiếp SummaryStats
        const data = await summaryApi.getSummary();
        setSummaryStats(data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu dashboard:", error);
        toast.error("Không thể tải dữ liệu tổng quan.");
        setError("Lỗi khi lấy dữ liệu từ server.");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-600">
        <Loader2 className="animate-spin w-6 h-6 mr-2" />
        Đang tải dữ liệu Dashboard...
      </div>
    );
  }

  if (error || !summaryStats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-red-600">
        <p className="font-medium mb-2">Không thể tải dữ liệu Dashboard.</p>
        <p className="text-sm text-gray-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto p-2">
      {/* Main Content */}
      <main className="p-6 w-full">
        

        {/* Summary Cards */}
        <DashboardSummaryCards
          summaryStats={summaryStats}
          formatCurrency={formatCurrency}
        />

        {/* Charts Section */}
        <DashboardCharts formatCurrency={formatCurrency} />

        {/* Active Tickets Table */}
        <DashboardActiveTickets
          summaryStats={summaryStats}
          formatCurrency={formatCurrency}
        />
      </main>
    </div>
  );
}
