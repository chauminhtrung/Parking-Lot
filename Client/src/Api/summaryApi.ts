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
  getSummary: async (): Promise<SummaryStats> =>
    (await axios.get(BASE_URL)).data,
};

export default summaryApi;
