"use client"

import type { ParkingStats } from "../../Types/parking"
import type { User } from "../../Types/User";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useEffect } from "react";

interface HeaderProps {
  floors: string[]
  currentFloor: string
  onFloorChange: (floor: string) => void
  onAddFloor: () => void
  stats: ParkingStats
  onMobileMenuToggle?: () => void
  user: User | null; // ✅ Thêm prop user
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

// SVG Icons
const BellIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
    />
  </svg>
)

const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
)

const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)

export default function Header({
  floors,
  currentFloor,
  onFloorChange,
  onAddFloor,
  stats,
  onMobileMenuToggle,
  user,
  setUser
}: HeaderProps) {

  const navigate = useNavigate();
  const { lotId } = useParams<{ lotId: string }>();
  const location = useLocation();



  const handleFloorChange = (floor: string) => {
    onFloorChange(floor);

    // Chỉ redirect khi đang ở parkingmap
    if (location.pathname.includes("parkingmap")) {
      // /23/home/parkingmap → thêm floor param
      const basePath = location.pathname.split("/").slice(0, 3).join("/"); // /:lotId/home
      navigate(`${basePath}/parkingmap/${floor}`);
    }
  };
  
  return (
<div className="">
      {/* Hiển thị thông tin người dùng */}
      {user  ? (
        
    <header className="sticky top-0 z-10 bg-[#F9FBFC] backdrop-blur-sm  px-3 md:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 text-gray-600 hover:text-purple-600 transition-colors"
          >
            <MenuIcon />
          </button>

          <span className="text-sm font-medium text-gray-600 hidden sm:block">Floor</span>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 overflow-x-auto">
              {floors.map((floor, index) => (
                <button
                  key={floor}
                  onClick={() => handleFloorChange(floor)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    currentFloor === floor
                      ? "bg-gradient-to-r from-[#a9a4eb]  to-[#6A63F0] text-white"
                      : "bg-gray-100 text-gray-700"
                  } ${index >= 3 ? 'hidden sm:block' : ''}`}
                >
                   {floor}
                </button>
              ))}
            </div>


             {lotId != "none"  ? ( <>
                         <button
              onClick={onAddFloor}
              className="w-10 h-10 font-bold rounded-lg bg-gray-100   flex items-center justify-center text-gray-600 hover:text-purple-400 transition-colors"
              title="Add new floor"
            > +
            </button>
             </>
              
              ) : (<></>)}
          </div>
        </div>

        <div className="flex items-center space-x-3 md:space-x-6">
          {/* Parking Stats */}
          <div className="flex items-center space-x-2 md:space-x-4 text-sm">
            <div className="flex items-center space-x-1 md:space-x-2">
              <div className="w-3 h-3 bg-green-300 border-green-400 rounded-full"></div>
              <span className="font-medium text-gray-700">{stats.filled}</span>
              <span className="text-gray-500 hidden sm:inline">Filled</span>
            </div>
            
            <div className="flex items-center space-x-1 md:space-x-2">
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <span className="font-medium text-gray-700">{stats.empty}</span>
              <span className="text-gray-500 hidden sm:inline">Empty</span>
            </div>
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button className="p-2 text-gray-600 hover:text-purple-600 transition-colors">
              <BellIcon />
            </button>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-white">4</span>
            </div>
          </div>

          {/* Report Problem Button */}
          <button className="px-3 md:px-4 py-2 bg-gradient-to-r from-[#a9a4eb] to-[#6A63F0] hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors">
            <span className="hidden sm:inline">Report Problem</span>
            <span className="sm:hidden">Report</span>
          </button>
        </div>
      </div>
    </header>
      ) : (
        <p className="text-sm text-gray-400">Chưa đăng nhập</p>
      )}


    </div>

  )
}