import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import bg from '../../assets/bg1.jpg'
import logo from '../../assets/Logo-removebg-preview.png'
import fb from '../../assets/SVG/fb.svg'
import tw from '../../assets/SVG/tw.svg'
import gg from '../../assets/SVG/gg.svg'
import gh from '../../assets/SVG/gh.svg'
import toast from "react-hot-toast";
import accountApi from "../../Api/accountApi";
import parkingLotApi from "../../Api/parkingLotApi";
import type { User } from "../../Types/User";

interface LoginProps {
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const Login: React.FC<LoginProps> = ({ setUser }) =>{
const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  const loadingToast = toast.loading("Đang đăng nhập...");

  try {
    const res = await accountApi.login(username, password);
    toast.dismiss(loadingToast);
    toast.success("🎉 Đăng nhập thành công!");

    localStorage.setItem("user", JSON.stringify(res));
    setUser(res); // ✅ Cập nhật state App
    // ✅ Gọi API lấy ParkingLot theo accountId
    const lots = await parkingLotApi.getParkingLotByAccountId(res.accountId);
    console.log(lots);
    
    if (Array.isArray(lots) && lots.length > 0) {
      const firstLot = lots[0];
      navigate(`/${firstLot.lotId}/home/parkingmap`);
    } else {
      navigate(`/none/home/parkingmap`);
    }


  } catch (err) {
    toast.dismiss(loadingToast);
    toast.error("❌ Sai tên đăng nhập hoặc mật khẩu!");
  }
};


return (
  <div className="relative  flex w-full h-screen bg-white">

  {/* Logo */}
  <div className="absolute top-4 left-4 flex items-center gap-2 z-20">
    <img
      src={logo}
      alt="Logo"
      style={{ width: '80px', height: '80px', objectFit: 'contain' }}
    />
  </div>

  {/* Cột hình minh họa */}
  <div className="hidden md:flex w-[75%] bg-gray-100 relative h-full items-center justify-center overflow-hidden">
    {/* Ảnh nền */}
    <img
      src={bg}
      alt="illustration"
      className="absolute inset-0 w-full h-full object-cover opacity-90"
    />

    {/* Lớp phủ mờ */}
    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

    {/* Nội dung ở giữa */}
    <div className="relative z-10 text-center">
      {/* Nội dung nếu cần */}
    </div>
  </div>




    {/* Cột form đăng nhập */}
    <div className="flex flex-col justify-center items-center w-full md:w-[25%] h-full bg-white p-8 md:p-16">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Chào mừng tới Parking Manager 👋🏻
          </h1>
          <p className="text-gray-500 mt-2">
           Hãy đăng nhập bằng tài khoản của bạn và trải nghiệm
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email or Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your email or username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="••••••••••••"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}

          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="accent-blue-600" />
              <span>Remember me</span>
            </label>
            <Link to="/forgotpassword" className="text-[#6A63F0] hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#503EE1] to-[#6A63F0]  text-white py-2 rounded-lg font-medium transition"
          >
            Đăng nhập
          </button>
        </form>

          <div className="text-center text-sm text-gray-600">
            New on our platform?{" "}
            <Link
              to="/register"
              className="text-[#503EE1] hover:underline font-medium"
            >
              Create an account
            </Link>
          </div>


        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-gray-500 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

<div className="flex justify-center gap-6">
  <button
    type="button"
    className="transition-transform duration-300 hover:scale-110"
  >
    <img
      src={fb}
      alt="Facebook"
      className="w-7 h-7"
      style={{ filter: 'brightness(0) saturate(100%) invert(35%) sepia(90%) saturate(3000%) hue-rotate(200deg) brightness(95%) contrast(90%)' }}
    />
  </button>

  <button
    type="button"
    className="transition-transform duration-300 hover:scale-110"
  >
    <img
      src={tw}
      alt="Twitter"
        className="w-7 h-7"
      style={{ filter: 'brightness(0) saturate(100%) invert(60%) sepia(90%) saturate(2500%) hue-rotate(175deg) brightness(105%) contrast(95%)' }}
    />
  </button>

  <button
    type="button"
    className="transition-transform duration-300 hover:scale-110"
  >
    <img
      src={gh}
      alt="GitHub"
        className="w-7 h-7"
      style={{ filter: 'brightness(0) saturate(100%) invert(0%)' }}
    />
  </button>

  <button
    type="button"
    className="transition-transform duration-300 hover:scale-110"
  >
    <img
      src={gg}
      alt="Google"
        className="w-7 h-7"
      style={{ filter: 'brightness(0) saturate(100%) invert(54%) sepia(94%) saturate(3200%) hue-rotate(1deg) brightness(101%) contrast(101%)' }}
    />
  </button>
</div>



      </div>
    </div>
  </div>
);


};

export default Login;
