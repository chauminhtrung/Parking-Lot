import axios from "axios";

// ✅ Interface dựa theo ParkingFloorResponse từ backend
export interface ParkingFloor {
  floorId?: number;
  lotId: number;
  floorNumber: number;
  description?: string;
  [key: string]: any;
}

const BASE_URL = "http://localhost:8080/api/floors"; // đổi port nếu backend khác

const floorApi = {
  // 🟢 Tạo tầng mới
  createFloor: async (data: ParkingFloor) => (await axios.post(BASE_URL, data)).data,

  // 🔵 Lấy danh sách tất cả tầng
  getAllFloors: async () => (await axios.get<ParkingFloor[]>(BASE_URL)).data,

  // 🟣 Lấy tầng theo ID
  getFloorById: async (id: number) => (await axios.get<ParkingFloor>(`${BASE_URL}/${id}`)).data,

  // 🟠 Cập nhật thông tin tầng
  updateFloor: async (id: number, data: ParkingFloor) =>
    (await axios.put(`${BASE_URL}/${id}`, data)).data,

  // 🔴 Xóa tầng
  deleteFloor: async (id: number) => (await axios.delete(`${BASE_URL}/${id}`)).data,

// 🟢 Lấy danh sách tầng theo lotId
getFloorsByLotId: async (lotId: number) =>
  (await axios.get<ParkingFloor[]>(`${BASE_URL}/lot/${lotId}`)).data,

// 🟢 Lấy tầng theo lotId và floorNumber
getFloorByLotIdAndFloorNumber: async (lotId: number, floorNumber: number) =>
  (await axios.get<ParkingFloor>(`${BASE_URL}/lot/${lotId}/floor/${floorNumber}`)).data,



};

export default floorApi;
