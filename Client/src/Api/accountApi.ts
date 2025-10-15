import axios from "axios";

interface Account {
  accountId?: number;
  username: string;
  password?: string;
  role?: string;
}

const BASE_URL = "http://localhost:8080/api/accounts";

const accountApi = {
  // 🟢 Tạo tài khoản
  createAccount: async (data: Account) =>
    (await axios.post(BASE_URL, data)).data,

  // 🟢 Cập nhật tài khoản
  updateAccount: async (id: number, data: Account) =>
    (await axios.put(`${BASE_URL}/${id}`, data)).data,

  // 🟢 Lấy danh sách tài khoản
  getAllAccounts: async () => (await axios.get(BASE_URL)).data,

  // 🟢 Lấy chi tiết theo ID
  getAccountById: async (id: number) =>
    (await axios.get(`${BASE_URL}/${id}`)).data,

  // 🟢 Xóa tài khoản
  deleteAccount: async (id: number) =>
    (await axios.delete(`${BASE_URL}/${id}`)).data,

  // 🟢 Đăng nhập
  login: async (username: string, password: string) =>
    (await axios.post(`${BASE_URL}/login`, { username, password })).data,
};

export default accountApi;
