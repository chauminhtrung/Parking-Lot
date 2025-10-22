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
  getMonthlyRevenue: async (year?: number): Promise<MonthlyRevenueResponse[]> => {
    try {
      const url = year
        ? `${BASE_URL}/monthly-revenue?year=${year}`
        : `${BASE_URL}/monthly-revenue`;

      const response = await axios.get<MonthlyRevenueResponse[]>(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching monthly revenue:", error);
      throw error;
    }
  },

  getVehicleDistribution: async (): Promise<VehicleTypeRatioResponse[]> => {
    try {
      const response = await axios.get<VehicleTypeRatioResponse[]>(
        `${BASE_URL}/vehicle-distribution`
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
