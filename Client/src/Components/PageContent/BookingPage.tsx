import React, { useState } from "react";
import type { User } from "../../Types/User";
import toast from "react-hot-toast";

interface Booking {
  id: string;
  Name: string;
  typecar: string;
  SDT: string;
  plate: string;
  slot: string;
  time: string;
  status: "Đã gửi" | "Chưa có";
}

interface BookingPageProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export default function BookingPage({ user, setUser }: BookingPageProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Tất Cả");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBooking, setNewBooking] = useState<Booking>({
    id: "",
    Name: "",
    typecar: "",
    SDT: "",
    plate: "",
    slot: "",
    time: "",
    status: "Chưa có",
  });

  const [bookings, setBookings] = useState<Booking[]>([
  
  ]);

  if (!user) {
    return <h2 className="text-xl text-gray-500 text-center mt-20">Chưa đăng nhập</h2>;
  }

  const filteredBookings = bookings.filter((b) => {
    const matchSearch = b.plate.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "Tất Cả" || b.status === filter;
    return matchSearch && matchFilter;
  });

  const handleAddBooking = () => {
    if (!newBooking.Name || !newBooking.plate || !newBooking.slot || !newBooking.typecar) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    setBookings([
      ...bookings,
      {
        ...newBooking,
        id: (bookings.length + 1).toString(),
        time: newBooking.time || new Date().toLocaleString(),
      },
    ]);
    setShowAddModal(false);
    setNewBooking({
      id: "",
      Name: "",
      typecar: "",
      SDT: "",
      plate: "",
      slot: "",
      time: "",
      status: "Chưa có",
    });
toast.success("Đặt chỗ thành công!");
  };

  return (
    <div className="w-full h-full overflow-y-auto p-2 bg-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center mt-4 bg-white p-4 rounded-xl shadow">
        <h1 className="text-xl font-semibold text-gray-700">📋 Quản lý Đặt chỗ</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
        >
          + Thêm Booking
        </button>
      </div>

      {/* Filter */}
      <div className="mt-6 flex flex-wrap items-center gap-3 bg-white p-4 rounded-xl shadow">
        <input
          type="text"
          placeholder="🔍 Tìm theo biển số xe..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-64 outline-none focus:ring focus:ring-indigo-200"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 outline-none"
        >
          <option value="Tất Cả">Tất Cả</option>
          <option value="Đã gửi">Đã gửi</option>
          <option value="Chưa có">Chưa có</option>
        </select>
      </div>

      {/* Table */}
      <div className="mt-6 bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm text-gray-700">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="py-3 px-4 text-left">Biển số</th>
              <th className="py-3 px-4 text-left">Chủ xe</th>
              <th className="py-3 px-4 text-left">Loại xe</th>
              <th className="py-3 px-4 text-left">SDT</th>
              <th className="py-3 px-4 text-left">Vị trí</th>
              <th className="py-3 px-4 text-left">Thời gian</th>
              <th className="py-3 px-4 text-left">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((b) => (
              <tr
                key={b.id}
                onClick={() => setSelectedBooking(b)}
                className="border-b hover:bg-gray-50 cursor-pointer transition"
              >
                <td className="py-3 px-4 font-semibold">{b.plate}</td>
                <td className="py-3 px-4 font-semibold">{b.Name}</td>
                <td className="py-3 px-4 font-semibold">{b.typecar}</td>
                <td className="py-3 px-4 font-semibold">{b.SDT}</td>
                <td className="py-3 px-4">{b.slot}</td>
                <td className="py-3 px-4">{b.time}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      b.status === "Đã gửi"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-500"
                    }`}
                  >
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal chi tiết */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[320px] animate-fadeIn">
            <h2 className="text-lg font-semibold mb-4 text-center">Thông tin chi tiết</h2>
            <p><strong>Biển số:</strong> {selectedBooking.plate}</p>
            <p><strong>Chủ xe:</strong> {selectedBooking.Name}</p>
            <p><strong>Loại xe:</strong> {selectedBooking.typecar}</p>
            <p><strong>SDT:</strong> {selectedBooking.SDT}</p>
            <p><strong>Vị trí:</strong> {selectedBooking.slot}</p>
            <p><strong>Thời gian:</strong> {selectedBooking.time}</p>
            <p>
              <strong>Trạng thái:</strong>{" "}
              <span
                className={`font-semibold ${
                  selectedBooking.status === "Đã gửi"
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {selectedBooking.status}
              </span>
            </p>
            <button
              onClick={() => setSelectedBooking(null)}
              className="mt-5 w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* Modal thêm mới */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[380px] animate-fadeIn">
            <h2 className="text-lg font-semibold mb-4 text-center">➕ Thêm Booking mới</h2>

            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Chủ xe"
                value={newBooking.Name}
                onChange={(e) => setNewBooking({ ...newBooking, Name: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
              <input
                type="text"
                placeholder="Loại xe"
                value={newBooking.typecar}
                onChange={(e) => setNewBooking({ ...newBooking, typecar: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
              <input
                type="text"
                placeholder="Số điện thoại"
                value={newBooking.SDT}
                onChange={(e) => setNewBooking({ ...newBooking, SDT: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
              <input
                type="text"
                placeholder="Biển số xe"
                value={newBooking.plate}
                onChange={(e) => setNewBooking({ ...newBooking, plate: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
              <input
                type="text"
                placeholder="Vị trí"
                value={newBooking.slot}
                onChange={(e) => setNewBooking({ ...newBooking, slot: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
              <select
                value={newBooking.status}
                onChange={(e) =>
                  setNewBooking({ ...newBooking, status: e.target.value as "Đã gửi" | "Chưa có" })
                }
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="Đã gửi">Đã gửi</option>
                <option value="Chưa có">Chưa có</option>
              </select>
            </div>

            <div className="flex justify-between mt-5">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleAddBooking}
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
