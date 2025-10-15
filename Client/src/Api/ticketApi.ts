import axios from "axios";

// 🟢 Request DTO tương ứng với TicketRequest (backend)
export interface TicketRequest {
  vehicleId: number;
  spotId: number;
  employeeId: number;
}

// 🔵 Response DTO tương ứng với TicketResponse (backend)
export interface TicketResponse {
  ticketId?: number;
  plateNumber: string;
  spotCode?: string;
  employeeName?: string;
  checkInTime?: string;
  checkOutTime?: string | null;
  fee?: number | null;
}

// 🔗 API URL
const BASE_URL = "http://localhost:8080/api/tickets";

// ⚙️ ticketApi service
const ticketApi = {
  // 🔵 Lấy toàn bộ vé
  getAllTickets: async () =>
    (await axios.get<TicketResponse[]>(BASE_URL)).data,

  // 🟣 Lấy vé theo ID
  getTicketById: async (id: number) =>
    (await axios.get<TicketResponse>(`${BASE_URL}/${id}`)).data,

  // 🟢 Check-in xe (tạo vé mới)
  checkInTicket: async (data: TicketRequest) =>
    (await axios.post<TicketResponse>(`${BASE_URL}/checkin`, data)).data,

  // 🟠 Check-out xe (cập nhật vé)
  checkOutTicket: async (ticketId: number) =>
    (await axios.post<TicketResponse>(`${BASE_URL}/checkout/${ticketId}`)).data,


  // 🔍 Lấy vé đang hoạt động theo spotId
getActiveTicketBySpot: async (spotId: number) =>
  (await axios.get<TicketResponse>(`${BASE_URL}/active/${spotId}`)).data,



};

export default ticketApi;
