import axios from "axios";

export interface ParkingSpot {
  spotId?: number;
  areaId: number;
  spotCode: string;
  status?: string;
  [key: string]: any;
}

const BASE_URL = "http://localhost:8080/api/spots";

const parkingSpotApi = {
  // 🔵 Lấy tất cả chỗ đỗ
  getAllParkingSpots: async () =>
    (await axios.get<ParkingSpot[]>(BASE_URL)).data,

  // 🟣 Lấy chỗ đỗ theo ID
  getParkingSpotById: async (id: number) =>
    (await axios.get<ParkingSpot>(`${BASE_URL}/${id}`)).data,

  // 🟢 Lấy chỗ đỗ theo Area ID
  getSpotsByAreaId: async (areaId: number) =>
    (await axios.get<ParkingSpot[]>(`${BASE_URL}/area/${areaId}`)).data,

  // 🟢 Tạo mới chỗ đỗ
  createParkingSpot: async (data: ParkingSpot) =>
    (await axios.post(BASE_URL, data)).data,

  // 🟠 Cập nhật chỗ đỗ
  updateParkingSpot: async (id: number, data: ParkingSpot) =>
    (await axios.put(`${BASE_URL}/${id}`, data)).data,

  // 🔴 Xóa chỗ đỗ
  deleteParkingSpot: async (id: number) =>
    (await axios.delete(`${BASE_URL}/${id}`)).data,

// 🔵 Cập nhật trạng thái chỗ đỗ theo spotId
updateParkingSpotStatus: async (spotId: number, status: string) =>
  (
    await axios.put(`${BASE_URL}/${spotId}/status`, { status })
  ).data,


};




export default parkingSpotApi;
