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
import type { TicketRequest } from "../../Api/ticketApi";
import ticketApi from "../../Api/ticketApi";
import parkingLotApi from "../../Api/parkingLotApi";
import customerApi from "../../Api/customerApi";
import parkingAreaApi from "../../Api/parkingAreaApi";
import floorApi  from "../../Api/parkingFloorApi";
import parkingSpotApi from "../../Api/parkingSpotApi";
import toast from "react-hot-toast";
import vehicleTypeApi from "../../Api/vehicleTypeApi";
import type { VehicleTypeResponse } from "../../Api/vehicleTypeApi";
import type { VehicleRequest } from "../../Api/vehicleApi";
import vehicleApi from "../../Api/vehicleApi";
import employeeApi from "../../Api/employeeApi";
import caricon from '../../assets/caricon.png'
import motoicon from '../../assets/motoicon.png'
import truckicon from '../../assets/trucicon.png' 


interface ParkingMapProps {
  user: User | null; // ✅ Thêm prop user
   setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

interface Zone {
  id: number;
  areaName: string;
  spotCount: number;
}

interface Slot {
  id: string;            // hiển thị, ví dụ 'A1'
  spotId?: number;       // id thực từ DB (nếu có)
  status?: string;       // 'Empty' / 'Occupied'
  vehicleIcon?: string;
}

interface ZoneS2 extends Zone {  // kế thừa Zone
  left: Slot[];
  right: Slot[];
   spots?: Slot[]; // toàn bộ spots từ API (tuỳ chọn)
}


const ParkingMap: React.FC<ParkingMapProps> = ({ user, setUser }) => {
  const [selectedZone, setSelectedZone] = useState<ZoneS2 | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null); // 🆕 slot chọn
  const [isVisible, setIsVisible] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createMode, setCreateMode] = useState<"manual" | "excel" | null>(null);
  const [selectedZones, setSelectedZones] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { lotId, floor } = useParams<{ lotId: string; floor?: string }>();
  const [zones, setZones] = useState<ZoneS2[]>([]);
const [loading, setLoading] = useState(false);
const navigate = useNavigate();
const [vehicleTypes, setVehicleTypes] = useState<VehicleTypeResponse[]>([]);
const [carPlate, setCarPlate] = useState("");
const [carOwner, setCarOwner] = useState("");
const [carPhone, setCarPhone] = useState("");



useEffect(() => {
  const fetchVehicleTypes = async () => {
    try {
      const data = await vehicleTypeApi.getAllVehicleTypes();
      setVehicleTypes(data);
    } catch (err) {
      console.error("Lỗi khi fetch loại xe:", err);
    }
  };
  fetchVehicleTypes();
}, []);


// Giả sử bạn muốn gán icon theo typeId
const carIcons = vehicleTypes.map((vt) => {
  let iconSrc: string;
  switch (vt.typeId) {
    case 1:
      iconSrc = FaCarSide;
      break;
    case 2:
      iconSrc = FaTruckPickup;
      break;
    case 3:
      iconSrc = FaShuttleVan;
      break;
    default:
      iconSrc = caricon; // fallback icon
  }

  return {
    id: vt.typeId!,
    icon: <img src={iconSrc} alt={vt.typeName} className="w-8 h-8" />,
  };
});



const handleCreateVehicle = async () => {
  if (!carPlate || !carOwner || !carPhone || !selectedIcon || !selectedSlot) {
    toast.error("Vui lòng điền đầy đủ thông tin và chọn chỗ đỗ!");
    return;
  }

  try {
    // 1️⃣ Tạo Customer
    const newCustomer = await customerApi.createCustomer({
      fullName: carOwner,
      phone: carPhone,
      address: "",
    });

    const newEmployee = await employeeApi.createEmployee({
      fullName: user?.username!,
      position: "Admin", // hoặc lấy từ form nếu cần
    });
    const employeeId = newEmployee.employeeId;
    if (!employeeId) throw new Error("Lỗi lấy ID nhân viên mới");

    const customerId = newCustomer.customerId;
    console.log(newCustomer);
    
    if (!customerId) throw new Error("Lỗi lấy ID khách hàng mới");

    // 2️⃣ Tạo Vehicle
    const vehicleRequest: VehicleRequest = {
      plateNumber: carPlate,
      typeId: selectedIcon,
      customerId: customerId,
    };

    const newVehicle = await vehicleApi.createVehicle(vehicleRequest);

    // 3️⃣ Tạo Ticket
    const ticketRequest: TicketRequest = {
      vehicleId: newVehicle.vehicleId!,
      spotId: selectedSlot.spotId!,
      employeeId: employeeId!,
    };

    await ticketApi.checkInTicket(ticketRequest);


    toast.success(`Đặt xe thành công! Biển số: ${newVehicle.plateNumber}`);

    // 5️⃣ Reset form / đóng modal
    setCarPlate("");
    setCarOwner("");
    setCarPhone("");
    setSelectedIcon(null);
    closeModal();

    // 6️⃣ Reload trang hoặc fetch lại zones
    window.location.reload();

  } catch (err: any) {
    console.error(err);
    toast.error(err?.message || "Đặt xe thất bại!");
  }
};


// Tạo 1 zone với 4 slot trái/phải


const fetchZones = async () => {
  try {
    if (!lotId || !floor) return;
    setLoading(true);

    const floorData = await floorApi.getFloorByLotIdAndFloorNumber(Number(lotId), Number(floor));
    if (!floorData?.floorId) return;

    const areaData = await parkingAreaApi.getAreasByFloorId(floorData.floorId);

    const spotsPromises = areaData.map((a: any) =>
      parkingSpotApi.getSpotsByAreaId(Number(a.areaId)).catch(err => {
        console.error("Error fetching spots for area", a.areaId, err);
        return [];
      })
    );
    const spotsResults = await Promise.all(spotsPromises);

    const zonesS2: ZoneS2[] = await Promise.all(
      areaData.map(async (area: any, idx: number) => {
        const spotsFromApi: any[] = spotsResults[idx] || [];

        // 🟢 Kiểm tra vé đang hoạt động cho từng spot
        const slots: Slot[] = await Promise.all(
          spotsFromApi.map(async (s) => {
            let vehicleIcon = undefined;
              try {
                const activeTicket = await ticketApi.getActiveTicketBySpot(s.spotId);
                if (activeTicket) {
                  // Lấy thông tin xe theo biển số
                  const vehicle = await vehicleApi.getVehicleByPlate(activeTicket.plateNumber);

                  // Kiểm tra loại xe (vehicleTypeId)
                  const typeId = vehicle?.vehicleType
                  if (typeId === "Car") vehicleIcon = caricon;
                  else if (typeId  === "Motorbike") vehicleIcon = motoicon;
                  else if (typeId  === "Truck") vehicleIcon = truckicon;
                }
              } catch (err) {
      
              }


            return {
              id: s.spotCode,
              spotId: s.spotId,
              status: vehicleIcon ? "occupied" : s.status,
              vehicleIcon,
            };
          })
        );

        const desired = Number(area.spotCount) || slots.length;
        if (slots.length < desired) {
          const nextIndexStart = slots.length + 1;
          for (let i = nextIndexStart; i <= desired; i++) {
            slots.push({ id: `${area.areaName}${i}` });
          }
        }

        const left: Slot[] = [];
        const right: Slot[] = [];
        for (let i = 0; i < slots.length; i++) {
          if (i % 2 === 0) left.push(slots[i]);
          else right.push(slots[i]);
        }

        return {
          id: area.areaId,
          areaName: area.areaName,
          spotCount: desired,
          left,
          right,
          spots: slots,
        } as ZoneS2;
      })
    );

    setZones(zonesS2);
  } catch (error) {
    console.error("❌ Lỗi khi fetch zone:", error);
  } finally {
    setLoading(false);
  }
};


useEffect(() => {
  fetchZones();
}, [lotId, floor]);




const ParkingZone: React.FC<{ zone?: ZoneS2; onSetup?: (zone: ZoneS2) => void }> = ({ zone, onSetup }) => {
  if (!zone) return null;

  return (
    <div className="bg-white rounded-xl overflow-hidden w-full">
      <div className="flex justify-center py-2">
        <button
          className="px-4 py-2 bg-gray-100 text-gray-800 font-bold rounded-full hover:bg-gray-200 transition"
          onClick={() => onSetup && onSetup(zone)}
        >
          {zone.areaName}
        </button>
      </div>
    {zone.left.map((slot, i) => (
      <ParkingRow key={i} left={slot} right={zone.right[i]} />
    ))}
    </div>
  );
};






   const handleSetupZone = (zone: ZoneS2) => {
    setSelectedZone(zone); // 👉 mở modal
    setSelectedSlot(null); // reset slot khi mở zone
  };

    const handleSetupSlot = (slot: Slot) => {
    setSelectedSlot(slot); 
    setSelectedZone(null); // reset zone khi mở slot
  };

const closeModal = () => {
  setSelectedZone(null);
  setSelectedSlot(null);
};


const renderRows = (zones: ZoneS2[]) => {
  // Lọc zone có ít nhất 1 slot
  const filteredZones = zones.filter(z => z.left.length > 0 || z.right.length > 0);

  const total = filteredZones.length;


  if (total <= 3) {
    // Trường hợp 3 zone hoặc ít hơn: chỉ 1 row
    return (
<div className="flex flex-row gap-6 mb-6 justify-center items-center relative">
  {/* Zone A */}
  <div className="relative flex flex-col items-center w-[450px]">
    <img  src={arrowLeftImg} className="absolute -top-16 w-28 h-16 " /> 
    <img src={FaArrowDown} className="absolute -left-24 top-1/2 -translate-y-1/2 w-18 h-20 text-gray-200" />
    <ParkingZone zone={zones[0]} onSetup={handleSetupZone} />
    <img  src={arrowImg} className="absolute -bottom-16 w-28 h-16 text-gray-200" />
  </div>

  {/* Mũi tên giữa A và B - chỉ 1 lần */}
  <img src={FaArrowDown} className="w-18 h-20 text-gray-200" />

  {/* Zone B */}
  <div className="relative flex flex-col items-center w-[450px]">
     <img  src={arrowLeftImg} className="absolute -top-16 w-28 h-16 " /> 
    <ParkingZone zone={zones[1]} onSetup={handleSetupZone} />
  <img  src={arrowImg} className="absolute -bottom-16 w-28 h-16 text-gray-200" />
  </div>

  {/* Mũi tên giữa B và C - chỉ 1 lần */}
  <img src={FaArrowDown} className="w-18 h-20 text-gray-200" />

  {/* Zone C */}
  <div className="relative flex flex-col items-center w-[450px]">
    <img  src={arrowLeftImg} className="absolute -top-16 w-28 h-16 " /> 
    <ParkingZone zone={zones[2]} onSetup={handleSetupZone} />
    <img src={FaArrowDown} className="absolute -right-24 top-1/2 -translate-y-1/2 w-18 h-20 text-gray-200" />
   <img  src={arrowImg} className="absolute -bottom-16 w-28 h-16 text-gray-200" />
  </div>
</div>
    );
  }

  // Lấy row đầu và row cuối
  const firstRow = filteredZones.slice(0, 3);
  const lastRow = filteredZones.slice(total - 3, total);
  const middleRow = filteredZones.slice(3, total - 3);



  return (
    <>
      {/* Row đầu */}
{/* Row 1: Zones A-C */}
<div className="flex flex-row gap-4 mb-4  justify-center items-center relative">
  {/* Zone A */}
  <div className="relative flex flex-col items-center w-[450px]">
    <img  src={arrowLeftImg} className="absolute -top-16 w-28 h-16" /> 
    <img src={FaArrowDown} className="absolute -left-24 top-1/2 -translate-y-1/2 w-18 h-20  text-gray-200" />
    <ParkingZone zone={zones[0]} onSetup={handleSetupZone} />
  
  </div>

  {/* Mũi tên giữa A và B - chỉ 1 lần */}
  <img src={FaArrowDown} className="w-18 h-20 text-gray-200" />

  {/* Zone B */}
  <div className="relative flex flex-col items-center w-[450px]">
     <img  src={arrowLeftImg} className="absolute -top-16 w-28 h-16" /> 
    <ParkingZone zone={zones[1]} onSetup={handleSetupZone} />

  </div>

  {/* Mũi tên giữa B và C - chỉ 1 lần */}
  <img src={FaArrowDown} className="w-18 h-20  text-gray-200" />

  {/* Zone C */}
  <div className="relative flex flex-col items-center w-[450px]">
    <img  src={arrowLeftImg} className="absolute -top-16 w-28 h-16" /> 
    <ParkingZone zone={zones[2]} onSetup={handleSetupZone} />
    <img src={FaArrowDown} className="absolute -right-24 top-1/2 -translate-y-1/2 w-18 h-20  text-gray-200" />
 
  </div>
</div>

      {/* Row giữa (nếu có) */}
      {middleRow.length > 0 && (
<div className="flex flex-row  gap-4 mb-4  justify-center items-center relative">
  {/* Zone D */}
  <div className="relative flex flex-col items-center w-[450px]">
      <img src={arrowLeftRightImg} className="w-28 h-16 " />
    <img src={FaArrowDown} className="absolute -left-24 top-1/2 -translate-y-1/2 w-18 h-20 text-gray-200" />
    <ParkingZone zone={zones[3]} onSetup={handleSetupZone} />

  </div>

  {/* Mũi tên giữa D và E */}
  <img src={FaArrowDown} className="w-18 h-20 text-gray-200" />

  {/* Zone E */}
  <div className="relative flex flex-col items-center w-[450px]">
     <img src={arrowLeftRightImg} className="  w-28 h-16  " />
    <ParkingZone zone={zones[4]}  onSetup={handleSetupZone} />

  </div>

  {/* Mũi tên giữa E và F */}
  <img src={FaArrowDown} className="w-18 h-20 text-gray-200" />

  {/* Zone F */}
  <div className="relative flex flex-col items-center w-[450px]">
     <img src={arrowLeftRightImg} className=" w-28 h-16" />
    <ParkingZone zone={zones[5]} onSetup={handleSetupZone} />
    <img src={FaArrowDown} className="absolute -right-24 top-1/2 -translate-y-1/2 w-18 h-20 text-gray-200" />

  </div>
</div>
      )}

      {/* Row cuối */}
<div className="flex flex-row  gap-4 mb-4   justify-center items-center relative">
  {/* Zone D */}
  <div className="relative flex flex-col items-center w-[450px]">
      <img src={arrowLeftRightImg} className="   w-28 h-16  " />
    <img src={FaArrowDown} className="absolute -left-24 top-1/2 -translate-y-1/2 w-18 h-20 text-gray-200" />
    <ParkingZone  zone={middleRow.length === 0 ? zones[3] : zones[6]} onSetup={handleSetupZone} />
    <img  src={arrowImg} className="absolute -bottom-16 w-28 h-16 text-gray-200" />
  </div>

  {/* Mũi tên giữa D và E */}
  <img src={FaArrowDown} className="w-18 h-20 text-gray-200" />

  {/* Zone E */}
  <div className="relative flex flex-col items-center w-[450px]">
     <img src={arrowLeftRightImg} className="   w-28 h-16  " />
<ParkingZone
  zone={middleRow.length === 0 ? zones[4] : zones[7]}
  onSetup={handleSetupZone}
/>
      <img  src={arrowImg} className="absolute -bottom-16 w-28 h-16 text-gray-200" />
  </div>

  {/* Mũi tên giữa E và F */}
  <img src={FaArrowDown} className="w-18 h-20 text-gray-200" />

  {/* Zone F */}
  <div className="relative flex flex-col items-center w-[450px]">
     <img src={arrowLeftRightImg} className="   w-28 h-16  " />
  <ParkingZone
  zone={middleRow.length === 0 ? zones[5] : zones[8]}
  onSetup={handleSetupZone}
/>

    <img src={FaArrowDown} className="absolute -right-24 top-1/2 -translate-y-1/2 w-18 h-20 text-gray-200" />
      <img  src={arrowImg} className="absolute -bottom-16 w-28 h-16 text-gray-200" />
  </div>
</div>



    </>
  );
};


const ParkingRow: React.FC<{ left?: Slot; right?: Slot }> = ({ left, right }) => {
  const getSlotStyle = (slot?: Slot) => {
    if (!slot) return "";
    return slot.status === "occupied"
      ? "bg-green-100 border-green-400"   // màu khác cho chỗ đã đặt
      : "bg-white border-gray-200";   // màu bình thường
  };

  const getSlotIcon = (slot?: Slot) => {
    if (!slot) return null;
    // nếu chỗ đã chiếm thì hiển thị icon xe
    if (slot.status === "occupied") {
      return (
        <img
          src={slot.vehicleIcon || "/icons/caricon.png"} // hoặc icon mặc định
          alt="vehicle"
          className="absolute w-14 h-14 object-contain opacity-90"
        />
      );
    }
    return null;
  };

  return (
    <div className="flex items-center h-20 relative">
      {/* LEFT SLOT */}
      <div
        className={`w-1/2 h-full flex items-center justify-end pr-3 relative border-b border-t cursor-pointer hover:bg-gray-100 ${getSlotStyle(left)}`}
        onClick={() => left && handleSetupSlot(left)}
      >
        {left && (
          <>
            {getSlotIcon(left)}
            <div className="text-sm font-semibold text-gray-700">{left.id} </div>
          </>
        )}
      </div>

      <div className="w-0.5 bg-gray-300 h-full" />

      {/* RIGHT SLOT */}
      <div
        className={`w-1/2 h-full flex items-center justify-start pl-3 relative border-b border-t cursor-pointer hover:bg-gray-100 ${getSlotStyle(right)}`}
        onClick={() => right && handleSetupSlot(right)}
      >
        {right && (
          <>
            {getSlotIcon(right)}
            <div className="text-sm font-semibold text-gray-700">{right.id}</div>
          </>
        )}
      </div>
    </div>
  );
};









  useEffect(() => {
    if (selectedZone || selectedSlot) {
      setTimeout(() => setIsVisible(true), 2);
    } else {
      setIsVisible(false);
    }
  }, [selectedZone, selectedSlot]);

  //render chính
return (
  <>
      {user ? (
  <div className="w-full h-full overflow-y-auto p-2  "
  >



   {loading ? (
      <p className="text-center text-gray-500">Đang tải dữ liệu...</p>
    ) : (
      <></>
    )}

     
       <div className="flex items-center gap-2 mb-2 justify-end">
          <span className="text-green-600 font-bold text-sm sm:text-lg lg:text-2xl">ENTRY</span>
          <div
            className="w-2 h-10 bg-green-500 rounded-full mb-1"
            style={{
              boxShadow: "-5px 0 4px rgba(93, 245, 101, 0.3)",
            }}
          ></div>
        </div>

     
        {renderRows(zones)}

  
        {selectedZone && (
          <div
            className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-500 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className={`bg-white rounded-lg shadow-lg p-6 w-[400px] relative transform transition-all duration-500 ${
                isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
              }`}
            >
        
              <button
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                onClick={closeModal}
              >
                <FaTimes />
              </button>

              <h2 className="text-xl font-bold mb-4">
                Cấu hình khu {selectedZone.areaName}
              </h2>

              <div className="w-full space-y-4">
             
                <div className="flex items-center justify-between gap-4">
                  <label className="text-gray-700 font-semibold whitespace-nowrap">
                    Chỗ đỗ:
                  </label>

                  <div className="flex flex-1 justify-center gap-6">
                    {[2, 4, 6, 8].map((num) => (
                      <label key={num} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="slot"
                          value={num}
                          className="form-radio"
                        />
                        {num}
                      </label>
                    ))}
                  </div>
                </div>

                <button className="w-full px-4 py-2 bg-[#503EE1] text-white rounded hover:bg-blue-600">
                  Lưu
                </button>
              </div>
            </div>
          </div>
        )}
        {selectedSlot && (
          <div
            className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-500 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className={`bg-white rounded-lg shadow-lg p-6 w-[400px] relative transform transition-all duration-500 ${
                isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
              }`}
            >
              <button
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                onClick={closeModal}
              >
                <FaTimes />
              </button>

              <h2 className="text-xl font-bold mb-4">
            Chỗ đỗ {selectedSlot.id}{" "}
            {selectedSlot.spotId && (
              <span className="text-gray-500 text-sm">(ID: {selectedSlot.spotId})</span>
            )}{" "}
            — {selectedSlot.status || "Trống"}
          </h2>


              <div className="space-y-4"> 

                  <div>
                    <label className="block mb-1 font-medium">Biển số xe</label>
                    <input
                      type="text"
                      value={carPlate}
                      onChange={(e) => setCarPlate(e.target.value)}
                      className="w-full border p-2 rounded"
                      placeholder="Nhập biển số xe..."
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">Tên chủ xe</label>
                    <input
                      type="text"
                      value={carOwner}
                      onChange={(e) => setCarOwner(e.target.value)}
                      className="w-full border p-2 rounded"
                      placeholder="Nhập tên..."
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">Số Điện thoại</label>
                    <input
                      type="text"
                      value={carPhone}
                      onChange={(e) => setCarPhone(e.target.value)}
                      className="w-full border p-2 rounded"
                      placeholder="090..."
                    />
                  </div>


              
                <div>
                  <label className="block mb-2 font-medium">
                    Chọn loại xe
                  </label>
              <div className="flex justify-center gap-4">
                {carIcons.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedIcon(c.id)}
                    className={`p-3 rounded-lg border transition ${
                      selectedIcon === c.id
                        ? "bg-[#503EE1] text-white border-white-500"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {c.icon}
                  </button>
                ))}
              </div>
                </div>

                <button  onClick={handleCreateVehicle} className="w-full px-4 py-2 bg-[#503EE1] text-white rounded hover:bg-blue-600">
                  Đặt / Cập nhật xe
                </button>
              </div>
            </div>
          </div>
        )}

      
        <div className="flex items-center gap-2 mt-2 justify-end">
          <span className="text-red-500 font-bold text-sm sm:text-lg lg:text-2xl">
            EXIT
          </span>
          <div
            className="w-2 h-10 bg-red-500 rounded-full mb-1"
            style={{
              boxShadow: "-5px 0 4px rgba(252, 99, 99, 0.3)",
            }}
          ></div>
        </div>  

  </div>
      ) : (
        <h2 className="text-xl text-gray-500">Chưa đăng nhập</h2>
      )}

  </>


);

};

export default ParkingMap;
