import React, { useState } from "react";
import type { User } from "../../Types/User";

interface Staff {
  id: string;
  name: string;
  username: string;
  password: string;
  role: "Nhân viên" | "Quản lý";
  phone: string;
  createdAt: string;
}

interface RolesPageProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export default function RolesPage({ user }: RolesPageProps) {
  const [staffs, setStaffs] = useState<Staff[]>([
    {
      id: "1",
      name: "Nguyễn Văn A",
      username: "vana",
      password: "123456",
      role: "Quản lý",
      phone: "0909123456",
      createdAt: "10/10/2025",
    },
    {
      id: "2",
      name: "Trần Thị B",
      username: "thib",
      password: "abcdef",
      role: "Nhân viên",
      phone: "0911123456",
      createdAt: "15/10/2025",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});

  const [newStaff, setNewStaff] = useState({
    name: "",
    username: "",
    password: "",
    role: "Nhân viên",
    phone: "",
  });

  const handleAddStaff = () => {
    if (!newStaff.name || !newStaff.username || !newStaff.password) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    setStaffs([
      ...staffs,
      {
        id: (staffs.length + 1).toString(),
        name: newStaff.name,
        username: newStaff.username,
        password: newStaff.password,
        role: newStaff.role as "Nhân viên" | "Quản lý",
        phone: newStaff.phone,
        createdAt: new Date().toLocaleDateString("vi-VN"),
      },
    ]);

    setNewStaff({ name: "", username: "", password: "", role: "Nhân viên", phone: "" });
    setShowModal(false);
  };

  if (!user)
    return <h2 className="text-xl text-gray-500 text-center mt-20">Chưa đăng nhập</h2>;

  return (
    <div className="w-full h-full overflow-y-auto p-4 bg-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow">
        <h1 className="text-lg font-semibold text-gray-800">👥 Danh sách nhân viên</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition"
        >
          ➕ Thêm nhân viên
        </button>
      </div>

      {/* Table */}
      <div className="mt-6 bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm text-gray-700">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="py-3 px-4 text-left">Tên nhân viên</th>
              <th className="py-3 px-4 text-left">Tài khoản</th>
              <th className="py-3 px-4 text-left">Mật khẩu</th>
              <th className="py-3 px-4 text-left">Vai trò</th>
              <th className="py-3 px-4 text-left">Số điện thoại</th>
              <th className="py-3 px-4 text-left">Ngày tạo</th>
            </tr>
          </thead>
          <tbody>
            {staffs.map((s) => (
              <tr key={s.id} className="border-b hover:bg-gray-50 transition">
                <td className="py-3 px-4 font-semibold">{s.name}</td>
                <td className="py-3 px-4">{s.username}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <span>
                      {showPassword[s.id] ? s.password : "•".repeat(s.password.length)}
                    </span>
                    <button
                      onClick={() =>
                        setShowPassword((prev) => ({
                          ...prev,
                          [s.id]: !prev[s.id],
                        }))
                      }
                      className="text-gray-500 hover:text-gray-700 text-sm"
                    >
                      {showPassword[s.id] ? "🙈" : "👁️"}
                    </button>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      s.role === "Quản lý"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {s.role}
                  </span>
                </td>
                <td className="py-3 px-4">{s.phone}</td>
                <td className="py-3 px-4">{s.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal thêm nhân viên */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[340px] animate-fadeIn">
            <h2 className="text-lg font-semibold mb-4 text-center">Thêm nhân viên mới</h2>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Họ tên"
                value={newStaff.name}
                onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full outline-none focus:ring focus:ring-indigo-200"
              />
              <input
                type="text"
                placeholder="Tài khoản đăng nhập"
                value={newStaff.username}
                onChange={(e) => setNewStaff({ ...newStaff, username: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full outline-none focus:ring focus:ring-indigo-200"
              />

              <input
                type="text"
                placeholder="Mật khẩu"
                value={newStaff.password}
                onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full outline-none focus:ring focus:ring-indigo-200"
              />

              <input
                type="text"
                placeholder="Số điện thoại"
                value={newStaff.phone}
                onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full outline-none focus:ring focus:ring-indigo-200"
              />
              <select
                value={newStaff.role}
                onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full outline-none focus:ring focus:ring-indigo-200"
              >
                <option value="Nhân viên">Nhân viên</option>
                <option value="Quản lý">Quản lý</option>
              </select>
            </div>

            <div className="flex justify-between mt-5">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleAddStaff}
                className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition"
              >
                Thêm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
