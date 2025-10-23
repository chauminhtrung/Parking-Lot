import { useEffect, useState, useRef } from "react";
import { Tooltip } from "react-tooltip";
import { useNavigate, useParams } from "react-router-dom";
import parkingLotApi from "../../Api/parkingLotApi";
import type {ParkingLot  } from "../../Api/parkingLotApi";
import toast from "react-hot-toast";
import type { User } from "../../Types/User";
import parkingAreaApi from "../../Api/parkingAreaApi";
import parkingSpotApi from "../../Api/parkingSpotApi";
import floorApi  from "../../Api/parkingFloorApi";

interface UserProfileProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export default function UserProfile({ user, setUser }: UserProfileProps) {
  const [showLogout, setShowLogout] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false); // 🟢 Thêm dòng này
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [floors, setFloors] = useState(0);
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const [lots, setLots] = useState<ParkingLot[]>([]);
  const [selectedLotId, setSelectedLotId] = useState<number | null>(null);
  const manageLotModalRef = useRef<HTMLDivElement>(null);
  const addLotModalRef = useRef<HTMLDivElement>(null);
    const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
const [floorAreas, setFloorAreas] = useState<{
  [floorNumber: number]: { count: number; areas: any[] };
}>({});
  const [areas, setAreas] = useState([
  { areaName: "", description: "", spotCount: 0 },
]);
  const { lotId } = useParams<{ lotId: string }>();


  const handleLogout = () => {
    toast.success("🎉 Đăng xuất thành công!");
    localStorage.removeItem("user");
    setTimeout(() => navigate("/login"), 1000);
  };

  // 🟢 Fetch danh sách bãi đỗ xe
useEffect(() => {
  if (!user) return; // user chưa có → không fetch

  const fetchLots = async () => {
    try {
      const data = await parkingLotApi.getParkingLotByAccountId(user.accountId);
      setLots(Array.isArray(data) ? data : [data]); // Đảm bảo là mảng
    } catch (err) {
      console.error("Lỗi khi lấy bãi đỗ:", err);
    }
  };

  fetchLots();
}, [user]);

  // 🔴 Xóa bãi đỗ
const handleDelete = (lotId: number) => {
  // Hiển thị toast xác nhận
  toast.custom((t) => (
    <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
      <p className="text-gray-800 mb-3">Bạn có chắc muốn xóa bãi đỗ này?</p>
      <div className="flex justify-end gap-2">
        <button
          onClick={async () => {
            toast.dismiss(t.id); // ẩn toast trước
            try {
              await parkingLotApi.deleteParkingLot(lotId);
              setLots((prev) => prev.filter((lot) => lot.lotId !== lotId));
              toast.success("Xóa thành công!");
            } catch (err) {
              console.error("Lỗi khi xóa:", err);
              toast.error("Xóa thất bại!");
            }
          }}
          className="px-3 py-1 bg-gradient-to-r from-[#a9a4eb] to-[#6A63F0] text-white rounded hover:bg-red-600"
        >
          Đồng ý
        </button>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          Hủy
        </button>
      </div>
    </div>
  ));
};

const handleCreateParkingLot = async () => {
  try {
    // 1️⃣ Kiểm tra dữ liệu cơ bản
    if (!name.trim() || !address.trim() || !description.trim()) {
      toast.error("❌ Vui lòng nhập đầy đủ thông tin bãi xe!");
      return;
    }

    if (floors <= 0) {
      toast.error("⚠️ Vui lòng nhập số tầng hợp lệ!");
      return;
    }

    // 2️⃣ Kiểm tra tầng & khu vực
    const hasValidFloor = Object.values(floorAreas).some(
      (f: any) => f.areas && f.areas.length > 0
    );
    if (!hasValidFloor) {
      toast.error("⚠️ Bạn cần chọn ít nhất 1 tầng và thêm khu vực cho tầng đó!");
      return;
    }

    // 3️⃣ Kiểm tra chi tiết từng khu vực (mô tả + số chỗ)
    for (const [floorNumber, floorData] of Object.entries(floorAreas)) {
      for (const area of floorData.areas) {
        if (!area.description.trim()) {
          toast.error(`⚠️ Vui lòng nhập mô tả cho khu ${area.areaName} ở tầng ${floorNumber}!`);
          return;
        }

        if (!area.spotCount) {
          toast.error(`⚠️ Vui lòng chọn số chỗ cho khu ${area.areaName} ở tầng ${floorNumber}!`);
          return;
        }
      }
    }

    // 4️⃣ Tạo bãi xe
    const newLot = await parkingLotApi.createParkingLot({
      lotName: name,
      address,
      accountId: user?.accountId,
    });

    const lotId = newLot.lotId;
    if (!lotId) throw new Error("Không lấy được lotId từ backend");

    // 5️⃣ Tạo các tầng + khu vực + chỗ đỗ
    for (let i = 1; i <= floors; i++) {
      const floorData = floorAreas[i];
      const newFloor = await floorApi.createFloor({
        lotId,
        floorNumber: i,
        description: `${description} - Tầng ${i}`,
      });

      const floorId = newFloor.floorId;
      if (!floorId || !floorData) continue;

      for (const area of floorData.areas) {
        // 🏗️ Tạo khu vực
        const newArea = await parkingAreaApi.createParkingArea({
          floorId,
          areaName: area.areaName,
          description: `Khu ${area.areaName} - Tầng ${i}: ${area.description}`,
          spotCount: area.spotCount,
        });

        // ✅ Tạo chỗ đỗ (Parking Spot) cho từng khu
        if (newArea.areaId && area.spotCount > 0) {
          for (let s = 1; s <= area.spotCount; s++) {
            const spotCode = `${area.areaName}${s}`; // ví dụ: A1, A2, A3
            await parkingSpotApi.createParkingSpot({
              areaId: newArea.areaId,
              spotCode,
              status: "Empty",
            });
          }
        }
      }
    }

    // 6️⃣ Thành công → Reset & thông báo
    toast.success(`🎉 Tạo bãi xe "${name}" thành công!`);
    if (user) setUser({ ...user });
    navigate(`/${lotId}/home/parkingmap`);

    setShowModal(false);
    setShowAddForm(false);
    setName("");
    setAddress("");
    setFloors(0);
    setDescription("");
    setSelectedFloor(null);
    setFloorAreas({});
    setAreas([{ areaName: "", description: "", spotCount: 0 }]);

  } catch (err: any) {
    toast.error("❌ Có lỗi xảy ra: " + err.message);
    setShowModal(false);
    setShowAddForm(false);
  }
};

  



  if (!user) return null;

  return (
    <>
      <div
        className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-purple-200 cursor-pointer"
        onClick={() => setShowLogout(!showLogout)}
      >
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-r from-[#503EE1] to-[#6A63F0] rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user.username.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-sm">{user.username}</p>
            <p className="text-gray-600 text-xs">{`${user.username}@gmail.com`}</p>
          </div>
        </div>

        {/* Nút Logout */}
        {showLogout && (
          <div className="mt-2 space-y-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLogout();
              }}
              className="w-full bg-red-500 hover:bg-red-600 text-white text-xs py-1 rounded transition"
            >
              Đăng xuất
            </button>

            {/* 🟢 Nút Tổng bãi xe */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowModal(true);
            }}
            className="w-full flex items-center justify-center gap-1 bg-gradient-to-r from-[#6A63F0] to-[#503EE1] hover:opacity-90 text-white text-xs py-1 rounded transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-plus"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Bãi xe</span>
          </button>

          </div>
        )}
      </div>

      {/* 🟣 Modal hiển thị danh sách bãi xe */}

{showModal && (
  <div
    className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
    onClick={() => setShowModal(false)}
  >
    <div
      className="bg-white rounded-xl shadow-lg w-[90%] md:w-[550px] max-h-[85vh] overflow-y-auto p-6 relative"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-3 mb-4">
        <div className="flex items-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[#6A63F0]"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <h2 className="text-lg font-semibold text-gray-800">
            {showAddForm ? "Thêm bãi đỗ xe" : "Danh sách bãi đỗ xe"}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {/* ➕ Chuyển qua form thêm */}
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-1 text-white bg-[#6A63F0] hover:bg-[#4e3de0] px-3 py-1.5 rounded-md text-sm"
            >
              +
              <span>Thêm</span>
            </button>
          )}

          <button
            onClick={() =>
              showAddForm ? setShowAddForm(false) : setShowModal(false)
            }
            className="text-gray-500 hover:text-gray-700 text-lg"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Nội dung */}
      {!showAddForm ? (
        // 🟣 DANH SÁCH BÃI XE
        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          {lots.length > 0 ? (
            lots.map((lot) => {
              const isActive = String(lot.lotId) === lotId;
              return (
                <div
                  key={lot.lotId}
                  className={`flex items-center justify-between border rounded-lg p-3 transition ${
                    isActive
                      ? "border-[#6A63F0] bg-purple-50 shadow-md"
                      : "border-gray-200 hover:shadow"
                  }`}
                >
                  <div>
                    <h6
                      className={`font-semibold ${
                        isActive ? "text-[#6A63F0]" : "text-gray-800"
                      }`}
                    >
                      Bãi đỗ: {lot.lotName}
                    </h6>
                    <p className="text-sm text-gray-600">{lot.address}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* ❌ Xóa */}
                    <button
                      onClick={() => {!isActive && handleDelete(lot.lotId!)
                            console.log(lot.lotId);
                            
                      }}
                      
                      disabled={isActive}
                      className={`transition ${
                        isActive
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-red-500 hover:text-red-600"
                      }`}
                      title={
                        isActive
                          ? "Không thể xóa bãi đang được quản lý"
                          : "Xóa bãi đỗ xe"
                      }
                    >
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash-2" > <polyline points="3 6 5 6 21 6"></polyline> <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path> <line x1="10" y1="11" x2="10" y2="17"></line> <line x1="14" y1="11" x2="14" y2="17"></line> </svg>
                    </button>

                    {/* ✏️ Sửa */}
                    <button
                      onClick={() => setSelectedLotId(lot.lotId!)}
                      className="text-blue-500 hover:text-blue-600 transition"
                    >
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit" > <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path> <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path> </svg>
                    </button>

                    {/* ➡️ Chi tiết */}
                    <button
                      onClick={() => {
                            setShowModal(false);
                        setShowAddForm(false);
                        navigate(`/${lot.lotId!}/home/parkingmap`)
          
                      }
                      
                      }
                      className={`transition ${
                        isActive
                          ? "text-[#6A63F0]"
                          : "text-green-600 hover:text-green-700"
                      }`}
                    >
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-right" > <line x1="5" y1="12" x2="19" y2="12"></line> <polyline points="12 5 19 12 12 19"></polyline> </svg>
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500 italic">
              Chưa có bãi đỗ nào.
            </p>
          )}
        </div>
      ) : (
        // 🟢 FORM THÊM BÃI XE
        <div className="max-h-[65vh] overflow-y-auto px-1">
 <form    className="space-y-4"
    onSubmit={(e) => {
      e.preventDefault(); // ngăn reload
      handleCreateParkingLot();
    }}>
    {/* Các input cơ bản */}

    <div className="grid grid-cols-2 gap-6">
      {/* Tên bãi */}
      <div className="flex flex-col">
        <label className="font-medium mb-1">Tên bãi:</label>
        <input
          type="text"
          className="border border-gray-300 rounded-md p-2"
          placeholder="Nhập tên bãi"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Địa chỉ */}
      <div className="flex flex-col">
        <label className="font-medium mb-1">Địa chỉ:</label>
        <input
          type="text"
          className="border border-gray-300 rounded-md p-2"
          required
          placeholder="Nhập địa chỉ"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      {/* Số tầng */}
      <div className="flex flex-col">
        <label className="font-medium mb-1">Số tầng:</label>
        <input
          type="number"
          required
          className="border border-gray-300 rounded-md p-2"
          placeholder="Nhập số tầng"
          value={floors}
          onChange={(e) => setFloors(Number(e.target.value))}
        />
      </div>

      {/* Mô tả */}
      <div className="flex flex-col">
        <label className="font-medium mb-1">Mô tả:</label>
        <input
          type="text"
          required
          className="border border-gray-300 rounded-md p-2"
          placeholder="Nhập mô tả"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
    </div>

    {/* 🧩 Nhập khu vực */}
 {/* 🧩 Quản lý khu vực theo tầng */}
<div className="border-t pt-4">
  <label className="font-medium mb-2 block">Danh sách tầng & khu vực:</label>

  {/* Chọn tầng */}
  {floors > 0 ? (
    <div className="space-y-4">
      {/* Danh sách tầng */}
      <div className="flex flex-wrap gap-2 mb-4">
        {Array.from({ length: floors }, (_, i) => i + 1).map((floor) => (
          <button
            key={floor}
            onClick={() => setSelectedFloor(floor)}
            className={`px-4 py-2 rounded ${
              selectedFloor === floor
                ? "bg-[#6A63F0] text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Tầng {floor}
          </button>
        ))}
      </div>

      {/* Khi chọn 1 tầng */}
      {selectedFloor && (
        <div>
          <label className="font-medium block mb-2">
            Nhập số lượng khu vực cho tầng {selectedFloor}:
          </label>

        <select
          
          className="border rounded-md p-2 w-full mb-4"
          value={floorAreas[selectedFloor]?.count || ""}
          onChange={(e) => {
            const count = Number(e.target.value);
            const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const newAreas = Array.from({ length: count }, (_, i) => ({
              areaName: letters[i] || `Area ${i + 1}`,
              description: "",
              spotCount: 0,
            }));
            setFloorAreas({
              ...floorAreas,
              [selectedFloor]: { count, areas: newAreas },
            });
          }}
        >
          <option value="">Chọn số khu vực</option>
          <option value={3}>3</option>
          <option value={6}>6</option>
          <option value={9}>9</option>
        </select>


          {/* Danh sách khu vực */}
        {floorAreas[selectedFloor]?.areas?.length > 0 && (
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {floorAreas[selectedFloor].areas.map((area, index) => (
              <div
                key={index}
                className="grid grid-cols-3 gap-3 border p-2 rounded-md bg-gray-50"
              >

                  <input
                    type="text"
                    className="border rounded-md p-2 bg-gray-50"
                    value={area.areaName}
                    readOnly
                  />
                  <input
                    type="text"
                    className="border rounded-md p-2"
                    placeholder="Mô tả"
                    required
                    value={area.description}
                    onChange={(e) => {
                      const updated = { ...floorAreas };
                      updated[selectedFloor].areas[index].description =
                        e.target.value;
                      setFloorAreas(updated);
                    }}
                  />
                <select
                  className="border rounded-md p-2"
                  value={area.spotCount}
                  onChange={(e) => {
                    const updated = { ...floorAreas };
                    updated[selectedFloor].areas[index].spotCount = Number(e.target.value);
                    setFloorAreas(updated);
                  }}
                >
                  <option value="">Chọn số chỗ</option>
                  <option value={2}>2</option>
                  <option value={4}>4</option>
                  <option value={6}>6</option>
                  <option value={8}>8</option>
                </select>

                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  ) : (
    <p className="text-gray-500 italic">Nhập số tầng để cấu hình khu vực.</p>
  )}
</div>


    {/* Nút xác nhận */}
    <button
    type="submit" 
      className="w-full px-4 py-2 bg-gradient-to-r from-[#a9a4eb] to-[#6A63F0] text-white rounded hover:bg-blue-600"
    >
      Xác nhận
    </button>
  </form>
        </div>
      )}
    </div>
  </div>
)}

    </>
  );
}
