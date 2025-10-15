import axios from "axios";

// 🟢 Request DTO — tương ứng với VehicleRequest (backend)
export interface VehicleRequest {
  plateNumber: string;
  typeId: number;
  customerId: number;
}

// 🔵 Response DTO — tương ứng với VehicleResponse (backend)
export interface VehicleResponse {
  vehicleId?: number;
  plateNumber: string;
  vehicleType: string;
  ownerName: string;
  [key: string]: any;
}

// 🔗 API endpoint
const BASE_URL = "http://localhost:8080/api/vehicles";

// ⚙️ vehicleApi service
const vehicleApi = {
  // 🔵 Lấy danh sách tất cả xe
  getAllVehicles: async () =>
    (await axios.get<VehicleResponse[]>(BASE_URL)).data,

  // 🟣 Lấy xe theo ID
  getVehicleById: async (id: number) =>
    (await axios.get<VehicleResponse>(`${BASE_URL}/${id}`)).data,

  // 🟢 Lấy xe theo biển số
  getVehicleByPlate: async (plate: string) =>
    (await axios.get<VehicleResponse>(`${BASE_URL}/plate/${plate}`)).data,

  // 🟠 Thêm xe mới
  createVehicle: async (data: VehicleRequest) =>
    (await axios.post<VehicleResponse>(BASE_URL, data)).data,

  // 🟣 Cập nhật thông tin xe
  updateVehicle: async (id: number, data: VehicleRequest) =>
    (await axios.put<VehicleResponse>(`${BASE_URL}/${id}`, data)).data,

  // 🔴 Xóa xe
  deleteVehicle: async (id: number) =>
    (await axios.delete(`${BASE_URL}/${id}`)).data,
};

export default vehicleApi;
