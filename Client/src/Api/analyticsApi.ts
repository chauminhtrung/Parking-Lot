import axios from "axios";

// Base URL
const BASE_URL = "http://localhost:8080/api/analytics";

// ============================================
// INTERFACES
// ============================================
export interface MonthlyRevenueResponse {
  month: string;
  car: number;
  motorbike: number;
  truck: number;
}

export interface VehicleTypeRatioResponse {
  name: string;
  value: number;
  color?: string;
  [key: string]: string | number | undefined; 
}

// ============================================
// API SERVICE
// ============================================
const analyticsApi = {
  /**
   * Lấy doanh thu theo tháng
   * @param accountId - ID của account (bắt buộc)
   * @param year - Năm cần query (optional, mặc định năm hiện tại)
   */
  getMonthlyRevenue: async (
    accountId: number, 
    year?: number
  ): Promise<MonthlyRevenueResponse[]> => {
    try {
      const params: Record<string, number> = { accountId };
      if (year) {
        params.year = year;
      }

      const response = await axios.get<MonthlyRevenueResponse[]>(
        `${BASE_URL}/monthly-revenue`,
        { params }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching monthly revenue:", error);
      throw error;
    }
  },

  /**
   * Lấy phân bố loại xe đang đỗ
   * @param accountId - ID của account (bắt buộc)
   */
  getVehicleDistribution: async (
    accountId: number
  ): Promise<VehicleTypeRatioResponse[]> => {
    try {
      const response = await axios.get<VehicleTypeRatioResponse[]>(
        `${BASE_URL}/vehicle-distribution`,
        { params: { accountId } }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching vehicle distribution:", error);
      throw error;
    }
  },

  healthCheck: async (): Promise<boolean> => {
    try {
      await axios.get(`${BASE_URL}/health`);
      return true;
    } catch (error) {
      console.error("API health check failed:", error);
      return false;
    }
  },
};

export default analyticsApi;