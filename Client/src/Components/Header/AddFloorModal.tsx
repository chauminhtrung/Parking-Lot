"use client"

import type React from "react"
import type { User } from "../../Types/User"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import floorApi from "../../Api/parkingFloorApi";
import parkingAreaApi from "../../Api/parkingAreaApi";
import parkingSpotApi from "../../Api/parkingSpotApi";


interface Zone {
  id: number
  areaName: string
  description: string
  spotCount: number
}

interface AddFloorModalProps {
  isOpen: boolean
  onClose: () => void
  onAddFloor: (floorName: string, zones: Zone[]) => void
  existingFloors: string[]
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  lotId?: string | number  // ✅ thêm prop này
}

const XIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

export default function AddFloorModal({
  isOpen,
  onClose,
  onAddFloor,
  existingFloors,
  user,
  setUser,
  lotId
}: AddFloorModalProps) {
  const [floorName, setFloorName] = useState("")
  const [error, setError] = useState("")
  const [zones, setZones] = useState<Zone[]>([])
  const [zoneCount, setZoneCount] = useState<number>(3) // số khu vực mặc định khi thêm
  const navigate = useNavigate();
  // 🧩 Thêm nhiều khu vực cùng lúc
const handleAddZone = () => {
  // Luôn bắt đầu lại từ 'A'
  const newZones: Zone[] = Array.from({ length: zoneCount }, (_, i) => {
    const areaLetter = String.fromCharCode(65 + i); // 65 = 'A'
    return {
      id: Date.now() + i,
      areaName: areaLetter,
      description: "",
      spotCount: 0,
    };
  });

  // Ghi đè danh sách khu vực cũ, không cộng dồn
  setZones(newZones);
};




  
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!floorName.trim()) {
    toast.error("⚠️ Vui lòng nhập tên tầng!");
    return;
  }

  if (existingFloors.includes(floorName.trim())) {
    toast.error("⚠️ Tầng này đã tồn tại!");
    return;
  }

  if (zones.length === 0) {
    toast.error("⚠️ Vui lòng thêm ít nhất 1 khu vực!");
    return;
  }

  try {


    if (!lotId) {
      toast.error("❌ Không tìm thấy ID bãi xe!");
      return;
    }

    // 🔹 2. Tạo tầng mới
    const newFloor = await floorApi.createFloor({
      lotId: Number(lotId),
      floorNumber: existingFloors.length + 1, // hoặc có thể dùng tên tầng nếu bạn muốn
      description: `Tầng ${floorName}`,
    });

    const floorId = newFloor.floorId;
    if (!floorId) throw new Error("Không lấy được floorId từ backend");

    // 🔹 3. Tạo khu vực + chỗ đỗ trong tầng mới
    for (const zone of zones) {
      const newArea = await parkingAreaApi.createParkingArea({
        floorId,
        areaName: zone.areaName,
        description: zone.description,
        spotCount: zone.spotCount,
      });

      if (newArea.areaId && zone.spotCount > 0) {
        for (let i = 1; i <= zone.spotCount; i++) {
          const spotCode = `${zone.areaName}${i}`;
          await parkingSpotApi.createParkingSpot({
            areaId: newArea.areaId,
            spotCode,
            status: "Empty",
          });
        }
      }
    }

    toast.success(`🎉 Đã thêm tầng "${floorName}" thành công!`);
    onAddFloor(floorName.trim(), zones);
    onClose();
    setTimeout(() => {
  window.location.reload();
}, 1000); // đợi 1 giây cho toast hiển thị rồi reload

  } catch (error: any) {
    console.error(error);
    toast.error("❌ Lỗi khi thêm tầng: " + error.message);
  }
};


  // 🧩 Cập nhật khu vực
  const handleZoneChange = (id: number, key: keyof Zone, value: string | number) => {
    setZones((prev) =>
      prev.map((z) => (z.id === id ? { ...z, [key]: value } : z))
    )
  }

  // 🧩 Xóa khu vực
  const handleDeleteZone = (id: number) => {
    setZones((prev) => prev.filter((z) => z.id !== id))
  }



  const handleClose = () => {
    setFloorName("")
    setZones([])
    setError("")
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {user ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
   <div
  className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 z-50 max-h-[80vh] overflow-y-auto"
  onClick={(e) => e.stopPropagation()}
>

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Thêm tầng mới</h2>
              <button
                onClick={handleClose}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XIcon />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Nhập tên tầng */}
              <div className="mb-4">
                <label
                  htmlFor="floorName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Tên tầng
                </label>
                <input
                  type="text"
                  id="floorName"
                  value={floorName}
                  onChange={(e) => {
                    setFloorName(e.target.value)
                    setError("")
                  }}
                  placeholder="e.g., B6, L1, P1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a9a4eb]"
                />
                {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
              </div>

              {/* Danh sách tầng hiện có */}
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">Những tầng đang có:</p>
                <div className="flex flex-wrap gap-2">
                  {existingFloors.map((floor) => (
                    <span
                      key={floor}
                      className="px-2 py-1 bg-gradient-to-r from-[#a9a4eb] to-[#6A63F0] text-white text-xs rounded"
                    >
                      {floor}
                    </span>
                  ))}
                </div>
              </div>

              {/* Khu vực trong tầng */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-gray-700">Khu vực</h3>
                  <div className="flex items-center gap-2">
                    <select
                      value={zoneCount}
                      onChange={(e) => setZoneCount(Number(e.target.value))}
                      className="border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                      <option value={3}>3 khu vực</option>
                      <option value={6}>6 khu vực</option>
                      <option value={9}>9 khu vực</option>
                    </select>
                    <button
                      type="button"
                      onClick={handleAddZone}
                      className="text-sm text-[#6A63F0] hover:underline"
                    >
                      + Thêm
                    </button>
                  </div>
                </div>

                {zones.length === 0 ? (
                  <p className="text-sm text-gray-400">Chưa có khu vực nào</p>
                ) : (
                  zones.map((zone) => (
                    <div
                      key={zone.id}
                      className="flex flex-col gap-2 mb-3 border p-3 rounded-lg"
                    >
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={zone.areaName}
                          onChange={(e) =>
                            handleZoneChange(zone.id, "areaName", e.target.value)
                          }
                          placeholder="Tên khu vực"
                          className="flex-1 px-2 py-1 border border-gray-300 rounded"
                        />
                        <select
                          value={zone.spotCount}
                          onChange={(e) =>
                            handleZoneChange(zone.id, "spotCount", Number(e.target.value))
                          }
                          className="px-2 py-1 border border-gray-300 rounded w-24"
                        >
                          <option value={0}>Số chỗ</option>
                          <option value={2}>2</option>
                          <option value={4}>4</option>
                          <option value={6}>6</option>
                          <option value={8}>8</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => handleDeleteZone(zone.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>

                      <textarea
                        value={zone.description}
                        onChange={(e) =>
                          handleZoneChange(zone.id, "description", e.target.value)
                        }
                        placeholder="Mô tả khu vực (ví dụ: khu xe máy, khu ô tô...)"
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  ))
                )}
              </div>

              {/* Nút hành động */}
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-[#a9a4eb] to-[#6A63F0] text-white rounded-lg transition-colors"
                >
                  Thêm tầng
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <h2 className="text-xl text-gray-500">Chưa đăng nhập</h2>
      )}
    </>
  )
}
