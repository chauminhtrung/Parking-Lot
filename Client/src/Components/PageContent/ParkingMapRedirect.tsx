import { useEffect, useState } from "react";
import FaArrowDown from '../../assets/down-arrow.png';
import { useNavigate, useParams } from "react-router-dom";
import arrowImg from '../../assets/right-arrow.png';
import arrowLeftImg from '../../assets/left-arrow.png';
import arrowLeftRightImg from '../../assets/left-right.png';
import { FaTimes } from "react-icons/fa";
import FaCarSide from '../../assets/motorbike_3721619.png';
import FaTruckPickup from '../../assets/truck_3722800.png';
import FaShuttleVan from '../../assets/hatchback_6469044.png';
import type { User } from "../../Types/User";
import parkingLotApi from "../../Api/parkingLotApi";
import parkingAreaApi from "../../Api/parkingAreaApi";
import floorApi  from "../../Api/parkingFloorApi";
import toast from "react-hot-toast";

interface ParkingMapProps {
  user: User | null; // ✅ Thêm prop user
   setUser: React.Dispatch<React.SetStateAction<User | null>>;
}


const ParkingMapRedirect: React.FC<ParkingMapProps> = ({ user, setUser }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createMode, setCreateMode] = useState<"manual" | "excel" | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
const [floorAreas, setFloorAreas] = useState<{
  [floorNumber: number]: { count: number; areas: any[] };
}>({});

  const [areas, setAreas] = useState([
  { areaName: "", description: "", spotCount: 0 },
]);
  const [selectedZones, setSelectedZones] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { lotId } = useParams<{ lotId: string }>();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [floors, setFloors] = useState(0);
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  

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

        // 🔥 Kiểm tra nếu người dùng không chọn số chỗ
        if (
          area.spotCount === undefined ||
          area.spotCount === null ||
          area.spotCount === 0 ||
          area.spotCount === ""
        ) {
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

    // 5️⃣ Tạo các tầng và khu vực
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
        await parkingAreaApi.createParkingArea({
          floorId,
          areaName: area.areaName,
          description: `Khu ${area.areaName} - Tầng ${i}: ${area.description}`,
          spotCount: area.spotCount,
        });
      }
    }

    // 6️⃣ Thành công → Thông báo + Reset form
    toast.success(`🎉 Tạo bãi xe "${name}" thành công!`);
    if (user) setUser({ ...user });
    navigate(`/${lotId}/home/parkingmap`);

   setShowCreateModal(false);
    setCreateMode(null);
    setName("");
    setAddress("");
    setFloors(0);
    setDescription("");
    setSelectedFloor(null);
    setFloorAreas({});
    setAreas([{ areaName: "", description: "", spotCount: 0 }]);

  } catch (err: any) {
    toast.error("❌ Có lỗi xảy ra: " + err.message);
   setShowCreateModal(false);
    setCreateMode(null);
  }
};









  //render chính
return (
  <>
      {user ? (
  <div className="w-full h-full overflow-y-auto p-2">
    {lotId === "none" ? (
      // ✅ Trường hợp KHÔNG có dữ liệu
 <div style={{ backgroundColor: '#fff', borderRadius: '10px', margin: '10px' }}>
      <div style={{ padding: '15px' }}>
        <div style={{ borderRadius: '10px' }}>
          <div style={{ borderRadius: '10px', padding: '30px', textAlign: 'center',justifyContent:"center" }}>
            <img
              style={{display:"inline"}}
              width="230px"
              src="https://firebasestorage.googleapis.com/v0/b/rrms-b7c18.appspot.com/o/images%2Fempty-box-4085812-3385481.webp?alt=media&token=eaf37b59-00e3-4d16-8463-5441f54fb60e"
            />
            <h4>Bạn chưa có khu đỗ xe nào! Vui lòng thêm bãi xe trước khi tiếp tục.</h4>
            <p>Với thiết kết đơn giản - thân thiện - dễ sử dụng. Quản lý bãi đỗ xe của bạn dễ hơn bao giờ hết.</p>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-12" style={{ display: 'grid' }}>
              <div
                style={{
                  display: 'grid',
                  backgroundImage:
                    'url(https://firebasestorage.googleapis.com/v0/b/rrms-b7c18.appspot.com/o/images%2Fbuilding.webp?alt=media&token=2b4b1a5a-feab-4b96-bb96-cf2e033a2c53)',
                  backgroundPosition: '90%',
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundColor: 'rgb(169 164 235)',
                  borderRadius: '15px',
                  padding: '30px',
                  margin: '40px',
                  marginTop: '0px',
                  color:"white"
                }}>
                <h3>Bắt đầu tạo bãi đỗ xe của bạn</h3>
                <p>Để nhập nhanh hơn hãy bắt đầu nhập tự tập tin excel</p>
                <ul className="stepProgress">
                  <li className="stepProgress-item">Bước 1: Tải file mẫu</li>
                  <li className="stepProgress-item">Bước 2: Nhập dữ liễu của bạn vào file mẫu</li>
                  <li className="stepProgress-item">Bước 3: Upload file mẫu lên để nhập liệu</li>
                </ul>
                <div>                 
          <button
            className="flex items-center gap-2 px-3 md:px-4 py-2 mt-2 bg-gradient-to-r from-[#a9a4eb] to-[#6A63F0] hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
            onClick={() => setShowCreateModal(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
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
            <span>Tạo bãi xe đầu tiên </span>
          </button>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
{showCreateModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 w-[400px] relative">
      {/* Nút đóng */}
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
          onClick={() => {
            setShowCreateModal(false);
            setCreateMode(null);
          }}
        >
          <FaTimes />
        </button>


      <h2 className="text-xl font-bold mb-4 text-center">Tạo bãi xe mới</h2>

      {/* 2 lựa chọn */}
      {!createMode && (
        <div className="space-y-4 text-center">
          <button
            onClick={() => setCreateMode("manual")}
            className="w-full px-4 py-2 bg-[#503EE1] text-white rounded hover:bg-blue-600"
          >
            Tạo thủ công
          </button>
          <button
            onClick={() => setCreateMode("excel")}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Nhập từ Excel
          </button>
        </div>
      )}

      {/* Giao diện tạo thủ công */}

{createMode === "manual" && (
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
)}


      {/* Giao diện nhập từ Excel */}
      {createMode === "excel" && (
                  <div className="import-from-excel-layout">
                    <ul className="stepProgress">
                      <li className="stepProgress-item">Bước 1: Tải file mẫu</li>
                      <li className="stepProgress-item">Bước 2: Nhập dữ liệu của bạn vào file mẫu</li>
                      <li className="stepProgress-item">Bước 3: Upload file mẫu lên để nhập liệu</li>
                    </ul>
                    <div className="row g-2">
                      <div className="col-6 mt-2 import-excel">
                        <div className="image-upload-simple" style={{ height: '100px' }}>
                          <input
                            type="file"
                            id="file-excel"
                            accept=".xlsx"
                            style={{ display: 'none' }}       
                            required
                          />
                          <div
                            className="container-upload"
                            id="import-excel-trigger"
                            style={{ border: '2px dashed #ccc',height: '80px' }}>
                            <label htmlFor="file-excel" style={{ width: '100%' }}>
                              <div
                                className="placeholderr __add-more-imge"
                                style={{
                                  display: 'grid',
                                  cursor: 'pointer',
                                  width: '100%',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  height: '100%',
                                  marginTop:'10px'
                                }}>
                                <div className="icon-upload "   >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="30"
                                    height="30"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="feather feather-upload-cloud">
                                    <polyline points="16 16 12 12 8 16"></polyline>
                                    <line x1="12" y1="12" x2="12" y2="21"></line>
                                    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path>
                                    <polyline points="16 16 12 12 8 16"></polyline>
                                  </svg>
                                </div>
                                <label style={{ textDecoration: 'underline' }} id="text-import">
                             
                                </label>
                              </div>
                            </label>
                          </div>
                          <div className="invalid-feedback"> Vui lòng chọn file Excel</div>
                        </div>
                      </div>
                      <div className="col-6 mt-2 download-template-excel">
                        <div style={{ color: 'inherit' }}>
                          <div className="image-upload-simple" style={{ height: '100px' }}>
                            <div
                              className="container-upload "
                              id="download-excel-trigger"
                              style={{ border: '2px dashed #ccc',height: '80px' }}>
                              <div
                                className="placeholderr __add-more-imge"
                                style={{
                                  display: 'grid',
                                  cursor: 'pointer',
                                  width: '100%',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  height: '100%',

                                }}>
                                <div className="icon-upload" style={{ marginTop:"10px",marginLeft:"45px" }}>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    width="24"
                                    height="24"
                                    className="main-grid-item-icon"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2">
                                    <polyline points="8 17 12 21 16 17"></polyline>
                                    <line x1="12" x2="12" y1="12" y2="21"></line>
                                    <path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"></path>
                                  </svg>
                                </div>
                                <label style={{ textDecoration: 'underline' }} id="text-download">
                                  Tải file Excel mẫu
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
      )}
    </div>
  </div>
)}
    </div>
    ) : (
    <></>
    )}
  </div>
      ) : (
        <h2 className="text-xl text-gray-500">Chưa đăng nhập</h2>
      )}

  </>


);

};

export default ParkingMapRedirect;
