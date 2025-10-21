"use client"

import React, { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import floorApi from "../../Api/parkingFloorApi"
import type { User } from "../../Types/User"
import type { ParkingFloor } from "../../Api/parkingFloorApi";

interface Floor {
  floorId: number
  floorNumber: number
  description: string
}

interface ManagerFloorProps {
  isOpen: boolean
  onClose: () => void
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  lotId?: string | number
  floors: ParkingFloor[]
  setFloors: React.Dispatch<React.SetStateAction<ParkingFloor[]>>
}


const XIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

export default function ManagerFloor({
  isOpen,
  onClose,
  user,
  setUser,
  lotId
}: ManagerFloorProps) {
  const [floors, setFloors] = useState<Floor[]>([])
  const [loading, setLoading] = useState(false)

const fetchFloors = async () => {
  if (!lotId) return;
  try {
    setLoading(true);
    const data = await floorApi.getFloorsByLotId(Number(lotId));
    setFloors(data as Floor[]);
  } catch (err: any) {
    console.error(err);
    toast.error("❌ Lỗi khi tải danh sách tầng!");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (isOpen) fetchFloors()
  }, [isOpen, lotId])

  // 🗑️ Xóa tầng
const handleDeleteFloor = (floorId: number) => {
  toast.custom((t) => (
    <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
      <p className="text-gray-800 mb-3">Bạn có chắc muốn xóa tầng này không?</p>
      <div className="flex justify-end gap-2">
        <button
          onClick={async () => {
            toast.dismiss(t.id);
            try {
              await floorApi.deleteFloor(floorId);
              toast.success("🗑️ Xóa tầng thành công!");
              setFloors((prev) => prev.filter(f => f.floorId !== floorId)); // ✅ update Main state
                  setTimeout(() => {
  window.location.reload();
}, 1000); // đợi 1 giây cho toast hiển thị rồi reload
            } catch (err) {
              console.error("Lỗi khi xóa tầng:", err);
              toast.error("❌ Lỗi khi xóa tầng!");
            }
          }}
          className="px-3 py-1 bg-gradient-to-r from-[#a9a4eb] to-[#6A63F0] text-white rounded hover:opacity-90 transition"
        >
          Đồng ý
        </button>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
        >
          Hủy
        </button>
      </div>
    </div>
  ));
};



  const handleClose = () => {
    setFloors([])
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

          {/* Modal chính */}
          <div
            className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-4 z-50 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Danh sách tầng trong bãi xe
              </h2>
              <button
                onClick={handleClose}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XIcon />
              </button>
            </div>

            {/* Nội dung */}
            {loading ? (
              <p className="text-gray-500 text-sm">Đang tải danh sách tầng...</p>
            ) : floors.length === 0 ? (
              <p className="text-gray-400 text-sm">Chưa có tầng nào trong bãi xe này.</p>
            ) : (
              <div className="space-y-3">
                {floors.map((floor) => (
                  <div
                    key={floor.floorId}
                    className="flex justify-between items-center bg-[#a9a4eb]   p-3 border rounded-lg shadow-sm hover:bg-gray-50 transition"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        Tầng {floor.floorNumber}
                      </p>
                      <p className="text-sm text-gray-500">
                        {floor.description || "Không có mô tả"}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteFloor(floor.floorId)}
                      className="text-red-500 hover:text-red-700 font-semibold"
                    >
                      Xóa
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <h2 className="text-xl text-gray-500">Chưa đăng nhập</h2>
      )}
    </>
  )
}
