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

export default function DashboardPage({ user }: DashboardPageProps) {
  const [summaryStats, setSummaryStats] = useState<SummaryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Lấy accountId từ user hoặc localStorage
  const accountId = user?.accountId || Number(localStorage.getItem("accountId")) || 1;
  const currentYear = new Date().getFullYear(); // 2025

  // ✅ Định dạng tiền tệ
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

        const data = await summaryApi.getSummary(accountId);
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
  }, [accountId]); // ✅ Thêm accountId vào dependency

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

  return user ? (
    <div className="w-full h-full overflow-y-auto p-2">
      <main className="p-6 w-full">
        {/* Summary Cards */}
        <DashboardSummaryCards
          summaryStats={summaryStats}
          formatCurrency={formatCurrency}
        />

        {/* Charts Section - ✅ TRUYỀN accountId và year */}
        <DashboardCharts 
          formatCurrency={formatCurrency}
          accountId={accountId}
          year={currentYear}
        />

        {/* Active Tickets Table */}
        <DashboardActiveTickets
          summaryStats={summaryStats}
          accountId={accountId}
          formatCurrency={formatCurrency}
        />
      </main>
    </div>
  ) : (
    <h2 className="text-xl text-gray-500 text-center mt-20">Chưa đăng nhập</h2>
  );
}