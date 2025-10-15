import axios from "axios";

// ✅ Interface dựa theo ParkingLotResponse từ backend
export interface ParkingLot {
  lotId?: number;
  lotName: string;
  address: string;
  accountUsername?: string;
  [key: string]: any;
}

const BASE_URL = "http://localhost:8080/api/lots"; // đổi port nếu server bạn chạy khác

const parkingLotApi = {
  // 🔵 Lấy tất cả bãi đỗ
  getAllParkingLots: async () => (await axios.get<ParkingLot[]>(BASE_URL)).data,

  // 🟣 Lấy bãi đỗ theo ID
  getParkingLotById: async (id: number) => (await axios.get<ParkingLot>(`${BASE_URL}/${id}`)).data,

  // 🟢 Tạo mới bãi đỗ
  createParkingLot: async (data: ParkingLot) => (await axios.post(BASE_URL, data)).data,

  // 🟠 Cập nhật bãi đỗ
  updateParkingLot: async (id: number, data: ParkingLot) =>
    (await axios.put(`${BASE_URL}/${id}`, data)).data,

  // 🔴 Xóa bãi đỗ
  deleteParkingLot: async (id: number) => (await axios.delete(`${BASE_URL}/${id}`)).data,

  // 🟡 Lấy bãi đỗ theo Account ID
  getParkingLotByAccountId: async (accountId: number) =>
    (await axios.get<ParkingLot>(`${BASE_URL}/account/${accountId}`)).data,


};

export default parkingLotApi;
