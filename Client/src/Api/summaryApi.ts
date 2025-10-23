import axios from "axios";

const BASE_URL = "http://localhost:8080/api/summary";

export interface SummaryStats {
  totalSpots: number;
  emptySpots: number;
  vehiclesParked: number;
  occupancyRate: number;
  todayRevenue: number;
}

const summaryApi = {
  // ✅ Gọi API có truyền accountId
  getSummary: async (accountId: number): Promise<SummaryStats> => {
    const response = await axios.get(BASE_URL, {
      params: { accountId },
    });
    return response.data;
  },
};

export default summaryApi;
