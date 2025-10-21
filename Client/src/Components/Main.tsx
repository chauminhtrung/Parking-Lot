import { useState, useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";
import { ArrowLeftEndOnRectangleIcon , ArrowRightEndOnRectangleIcon } from "@heroicons/react/24/solid";
import Sidebar from "./Sidebar/Sidebar";
import MobileSidebar from "./Sidebar/MobileSidebar";
import UserProfile from "./Profile/UserProfile";
import Header from "./Header/Header";
import type { User } from "../Types/User";
import AddFloorModal from "./Header/AddFloorModal";
import Managefloor from "./Header/ManagerFloor";
import floorApi  from "../Api/parkingFloorApi";
import type { ParkingFloor } from "../Api/parkingFloorApi";
import parkingSpotApi from "../Api/parkingSpotApi"; // ✅ nhớ import
import areaApi from "../Api/parkingAreaApi"; // giả sử đã có API lấy Area
//phan page content
import { Routes, Route } from "react-router-dom";
import ParkingMap from "./PageContent/ParkingMap";
import DashboardPage from "./PageContent/DasboardPage";
import ReportsPage from "./PageContent/ReportPage";
import BookingPage from "./PageContent/BookingPage";
import ManageFloorPage from "./PageContent/ManageFloorsPage";
import ProblemsPage from "./PageContent/problemsPage";
import RolesPage from "./PageContent/RolesPage";

// Khai báo kiểu dữ liệu cho tầng


interface MainProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}


function Main({ user, setUser }: MainProps) {
  // ✅ Khởi tạo dữ liệu tầng mẫu
  const [floors, setFloors] = useState<ParkingFloor[]>([]);
  const [currentFloor, setCurrentFloor] = useState("");
  const [isAddFloorModalOpen, setIsAddFloorModalOpen] = useState(false);
    const [isAddFloorModalOpen2, setIsAddFloorModalOpen2] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { lotId } = useParams<{ lotId: string }>(); 
 const [stats, setStats] = useState({ filled: 0, empty: 0 }); // ✅ thêm state

  useEffect(() => {
    const fetchFloors = async () => {
      if (!lotId) return;
      const data = await floorApi.getFloorsByLotId(Number(lotId));
      setFloors(data);
    };
    fetchFloors();
  }, [lotId]);

// Khi user đổi tầng
const handleFloorChange = (floor: string) => {
  setCurrentFloor(floor);
  localStorage.setItem("currentFloor", floor);
};

// Trong useEffect khi load lại trang
useEffect(() => {
  const savedFloor = localStorage.getItem("currentFloor");
  if (savedFloor && floors.some(f => f.floorNumber.toString() === savedFloor)) {
    setCurrentFloor(savedFloor);
  } else if (floors.length > 0) {
    setCurrentFloor(floors[0].floorNumber.toString());
  }
}, [floors]);





  // ✅ Tính thống kê (số chỗ trống / đầy)
  const getCurrentStats = () => {
    const filled = 0;
    const empty = 0;

    return { filled, empty };
  };

  // ✅ Thêm tầng mới
  const addFloor = (floorName: string) => {

  };

    // 🧮 Cập nhật stats khi đổi tầng
useEffect(() => {
  const fetchFloorStats = async () => {
    if (!currentFloor || !floors.length) return;

    try {
      // 1️⃣ Lấy floor đang chọn
      const selectedFloor = floors.find(
        (f) => f.floorNumber.toString() === currentFloor
      );
      if (!selectedFloor) return;

      // 2️⃣ Lấy tất cả area trong floor đó
      const areas = await areaApi.getAreasByFloorId(Number(selectedFloor.floorId));
      if (!areas.length) {
        setStats({ filled: 0, empty: 0 });
        return;
      }

      // 3️⃣ Lấy tất cả spots theo từng area
      const allSpotsArrays = await Promise.all(
        areas.map(area => parkingSpotApi.getSpotsByAreaId(Number(area.areaId)))
      );

      // 4️⃣ Flatten mảng spots
      const allSpots = allSpotsArrays.flat();

      // 5️⃣ Đếm filled và empty
      const filled = allSpots.filter(s => s.status === "Occupied").length;
      const empty = allSpots.filter(s => s.status === "Empty").length;

      // 6️⃣ Cập nhật state
      setStats({ filled, empty });
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu chỗ đỗ:", err);
      setStats({ filled: 0, empty: 0 });
    }
  };

  fetchFloorStats();
}, [currentFloor, floors]);





return (
  <div className="relative flex h-screen w-screen bg-white">
    {/* Sidebar (PC) */}
    <div className="hidden lg:block bg-[#F9FBFC]">
     <Sidebar onManageFloors={() => setIsAddFloorModalOpen2(true)} user={user} />
    </div>

         <div className="hidden lg:block">
        <UserProfile user={user} setUser={setUser} />
      </div>

    {/* Sidebar (Mobile) */}
    <MobileSidebar
      isOpen={isMobileSidebarOpen}
      onClose={() => setIsMobileSidebarOpen(false)}
      onManageFloors={() => setIsAddFloorModalOpen(true)}
      user={user}
    />

    {/* Nội dung chính */}
    <div className="flex-1 flex flex-col min-w-0">
      {/* Header nằm trên cùng */}
      <Header
        floors={floors.map(f => f.floorNumber.toString())}
        currentFloor={currentFloor}
        onFloorChange={handleFloorChange} // ✅
        onAddFloor={() => setIsAddFloorModalOpen(true)}
      stats={stats} // ✅ truyền stats thật
        onMobileMenuToggle={() => setIsMobileSidebarOpen(true)}
        user={user}
        setUser={setUser}
      />


     {/* ✅ Render route con ở đây */}
        <div className="flex-1 bg-white flex items-center justify-center w-full h-full overflow-y-auto">
       <Outlet context={{ user, setUser, floors, currentFloor, setCurrentFloor }} />

        </div>

    </div>


       <AddFloorModal
        isOpen={isAddFloorModalOpen}
        onClose={() => setIsAddFloorModalOpen(false)}
        onAddFloor={addFloor}
       existingFloors={floors.map(f => f.floorNumber.toString())}
         user={user}
         setUser={setUser}
         lotId={lotId} // ✅ thêm dòng này
      />

      
<Managefloor
  isOpen={isAddFloorModalOpen2}
  onClose={() => setIsAddFloorModalOpen2(false)}
  user={user}
  setUser={setUser}
  lotId={lotId}
  floors={floors}
  setFloors={setFloors} // ✅ truyền state từ Main
/>





  </div>
);

}

export default Main;
