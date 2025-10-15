import axios from "axios";

// 🔵 Interface tương ứng với VehicleTypeResponse (backend)
export interface VehicleTypeResponse {
  typeId?: number;
  typeName: string;
  pricePerHour: number;
  [key: string]: any;
}

// 🔗 API endpoint
const BASE_URL = "http://localhost:8080/api/vehicle-types"; // Đổi port nếu backend khác

// ⚙️ vehicleTypeApi service
const vehicleTypeApi = {
  // 🟢 Lấy danh sách tất cả loại xe
  getAllVehicleTypes: async () =>
    (await axios.get<VehicleTypeResponse[]>(BASE_URL)).data,

  // 🟣 Lấy loại xe theo ID
  getVehicleTypeById: async (id: number) =>
    (await axios.get<VehicleTypeResponse>(`${BASE_URL}/${id}`)).data,

  // 🟠 Tạo loại xe mới
  createVehicleType: async (data: Omit<VehicleTypeResponse, "typeId">) =>
    (await axios.post<VehicleTypeResponse>(BASE_URL, data)).data,

  // 🟡 Cập nhật loại xe
  updateVehicleType: async (id: number, data: VehicleTypeResponse) =>
    (await axios.put<VehicleTypeResponse>(`${BASE_URL}/${id}`, data)).data,

  // 🔴 Xóa loại xe
  deleteVehicleType: async (id: number) =>
    (await axios.delete(`${BASE_URL}/${id}`)).data,
};

export default vehicleTypeApi;
