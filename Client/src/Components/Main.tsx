import { useState, useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";
import { ArrowLeftEndOnRectangleIcon , ArrowRightEndOnRectangleIcon } from "@heroicons/react/24/solid";
import Sidebar from "./Sidebar/Sidebar";
import MobileSidebar from "./Sidebar/MobileSidebar";
import UserProfile from "./Profile/UserProfile";
import Header from "./Header/Header";
import type { User } from "../Types/User";
import AddFloorModal from "./Header/AddFloorModal";
import floorApi  from "../Api/parkingFloorApi";
import type { ParkingFloor } from "../Api/parkingFloorApi";
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
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { lotId } = useParams<{ lotId: string }>(); 


  useEffect(() => {
    const fetchFloors = async () => {
      if (!lotId) return;
      const data = await floorApi.getFloorsByLotId(Number(lotId));
      setFloors(data);
    };
    fetchFloors();
  }, [lotId]);

  useEffect(() => {
  if (floors.length > 0) {
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

return (
  <div className="relative flex h-screen w-screen bg-white">
    {/* Sidebar (PC) */}
    <div className="hidden lg:block bg-[#F9FBFC]">
     <Sidebar onManageFloors={() => setIsAddFloorModalOpen(true)} user={user} />
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
        floors={floors.map(f => f.floorNumber.toString())} // chỉ truyền tên tầng
        currentFloor={currentFloor}
        onFloorChange={setCurrentFloor}
        onAddFloor={() => setIsAddFloorModalOpen(true)}
        stats={getCurrentStats()}
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
      />

  </div>
);

}

export default Main;
