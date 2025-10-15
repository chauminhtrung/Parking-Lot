import axios from "axios";

// ✅ Interface dựa trên ParkingAreaResponse từ backend
export interface ParkingArea {
  areaId?: number;
  floorId: number;
  areaName: string;
  description?: string;
  spotCount: number;
  [key: string]: any;
}

const BASE_URL = "http://localhost:8080/api/areas"; // đổi port nếu cần

const parkingAreaApi = {
  // 🟢 Tạo khu vực đỗ xe mới
  createParkingArea: async (data: ParkingArea) => (await axios.post(BASE_URL, data)).data,

  // 🔵 Lấy danh sách tất cả khu vực
  getAllParkingAreas: async () => (await axios.get<ParkingArea[]>(BASE_URL)).data,

  // 🟣 Lấy khu vực theo ID
  getParkingAreaById: async (id: number) => (await axios.get<ParkingArea>(`${BASE_URL}/${id}`)).data,

  // 🟠 Cập nhật thông tin khu vực
  updateParkingArea: async (id: number, data: ParkingArea) =>
    (await axios.put(`${BASE_URL}/${id}`, data)).data,

  // 🔴 Xóa khu vực
  deleteParkingArea: async (id: number) => (await axios.delete(`${BASE_URL}/${id}`)).data,


 // 🟢 Lấy danh sách khu vực theo floorId
  getAreasByFloorId: async (floorId: number) =>
    (await axios.get<ParkingArea[]>(`${BASE_URL}/floor/${floorId}`)).data,


};

export default parkingAreaApi;
