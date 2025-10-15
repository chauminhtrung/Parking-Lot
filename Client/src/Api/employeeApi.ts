import axios from "axios";

export interface Employee {
  employeeId?: number;
  fullName: string;
  position: string;
  [key: string]: any; // cho phép thêm trường khác nếu backend có
}

const BASE_URL = "http://localhost:8080/api/employees"; // đổi port nếu backend khác

const employeeApi = {
  // 🟢 Tạo nhân viên
  createEmployee: async (data: Employee) => (await axios.post(BASE_URL, data)).data,

  // 🟡 Cập nhật nhân viên
  updateEmployee: async (id: number, data: Employee) => (await axios.put(`${BASE_URL}/${id}`, data)).data,

  // 🔵 Lấy tất cả nhân viên
  getAllEmployees: async () => (await axios.get<Employee[]>(BASE_URL)).data,

  // 🟣 Lấy nhân viên theo ID
  getEmployeeById: async (id: number) => (await axios.get<Employee>(`${BASE_URL}/${id}`)).data,

  // 🔴 Xóa nhân viên
  deleteEmployee: async (id: number) => (await axios.delete(`${BASE_URL}/${id}`)).data,
};

export default employeeApi;
