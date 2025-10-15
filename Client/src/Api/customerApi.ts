import axios from "axios";

export interface Customer {
  customerId?: number;
  fullName: string;
  phone: string;
  address?: string;
}

const BASE_URL = "http://localhost:8080/api/customers";

const customerApi = {
  // 🟢 Tạo khách hàng
  createCustomer: async (data: Customer) => (await axios.post(BASE_URL, data)).data,

  // 🟡 Cập nhật khách hàng
  updateCustomer: async (id: number, data: Customer) => (await axios.put(`${BASE_URL}/${id}`, data)).data,

  // 🔵 Lấy tất cả khách hàng
  getAllCustomers: async () => (await axios.get(BASE_URL)).data,

  // 🟣 Lấy khách hàng theo ID
  getCustomerById: async (id: number) => (await axios.get(`${BASE_URL}/${id}`)).data,

  // 🔴 Xóa khách hàng
  deleteCustomer: async (id: number) => (await axios.delete(`${BASE_URL}/${id}`)).data,
};

export default customerApi;
