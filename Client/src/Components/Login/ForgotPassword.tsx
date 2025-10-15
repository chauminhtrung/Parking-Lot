import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import fg from '../../assets/For.png'
import logo from '../../assets/Logo-removebg-preview.png'
import bg from '../../assets/bg1.jpg'

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    try {
      // Gửi request đến backend (bạn cần có API phù hợp, ví dụ /api/accounts/forgot-password)
      await axios.post("http://localhost:8080/api/accounts/forgot-password", { email });
      setMessage("Reset link has been sent to your email!");
    } catch (err) {
      setError("Email not found or something went wrong!");
    }
  };

  return (
    <div className="flex w-full h-screen bg-white">

  <div className="absolute top-4 left-4 flex items-center gap-2">
   <img
  src={logo}
  alt="Logo"
  style={{ width: '80px', height: '80px', objectFit: 'contain' }}
/>
    </div>

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

      {/* Form forgot password */}
      <div className="flex flex-col justify-center items-center w-full md:w-[25%] h-full bg-white p-8 md:p-16">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-800">Forgot Password 🔒</h1>
            <p className="text-gray-500 text-sm">
              Enter your email and we'll send you instructions to reset your password
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {error && <p className="text-red-600 text-sm text-center">{error}</p>}
            {message && <p className="text-green-600 text-sm text-center">{message}</p>}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#503EE1] to-[#6A63F0] hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
            >
              Send reset link
            </button>

            <div className="flex justify-center items-center text-sm text-gray-600 mt-3">
              <Link to="/login" className="flex items-center gap-1 text-[#503EE1] hover:underline">
                <i className="bx bx-chevron-left text-xl"></i>
                <span>Back to Login</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
