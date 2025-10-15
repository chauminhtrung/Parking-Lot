import axios from "axios";

// ✅ Interface dựa trên InvoiceResponse trong backend
export interface Invoice {
  invoiceId?: number;
  ticketId: number;
  issueDate: string; // kiểu string vì trong Java là String (thường là ISO date)
  totalAmount: number;
  [key: string]: any;
}

const BASE_URL = "http://localhost:8080/api/invoices"; // đổi port nếu cần

const invoiceApi = {
  // 🟢 Tạo hóa đơn mới
  createInvoice: async (data: Invoice) => (await axios.post(BASE_URL, data)).data,

  // 🔵 Lấy tất cả hóa đơn
  getAllInvoices: async () => (await axios.get<Invoice[]>(BASE_URL)).data,

  // 🟣 Lấy hóa đơn theo ID
  getInvoiceById: async (id: number) => (await axios.get<Invoice>(`${BASE_URL}/${id}`)).data,

  // 🔴 Xóa hóa đơn
  deleteInvoice: async (id: number) => (await axios.delete(`${BASE_URL}/${id}`)).data,
};

export default invoiceApi;
