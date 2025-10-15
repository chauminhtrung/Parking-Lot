import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./Components/Login/Login";
import Register from "./Components/Login/Register";
import ForgotPassword from "./Components/Login/ForgotPassword";
import Main from "./Components/Main";
import { Toaster } from "react-hot-toast";
import PrivateRoute from "./Components/Private/PrivateRoute";
import type { User } from "./Types/User";
import { useState, useEffect } from "react";


import ParkingMapWrapper  from "./Components/PageContent/ParkingMapWrapper ";

import DashboardPage from "./Components/PageContent/DasboardPage";
import ReportsPage from "./Components/PageContent/ReportPage";
import BookingPage from "./Components/PageContent/BookingPage";
import ProblemsPage from "./Components/PageContent/problemsPage";
import RolesPage from "./Components/PageContent/RolesPage";




function App() {
  const [user, setUser] = useState<User | null>(null);

  // ✅ Lấy user từ localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, [])

  return (
    <>
    <Routes>
      {/* Khi truy cập /login → hiển thị Login */}
      <Route path="/login" element={<Login setUser={setUser} />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />

{/* ✅ Protected routes */}
      <Route
        path="/:lotId/home"
        element={
          <PrivateRoute>
            <Main user={user} setUser={setUser} />
          </PrivateRoute>
        }
      >
       <Route path="parkingmap/:floor?" element={<ParkingMapWrapper user={user} setUser={setUser} />} />
        <Route path="dashboard" element={<DashboardPage user={user} setUser={setUser} />} />
        <Route path="reports" element={<ReportsPage user={user} setUser={setUser} />} />
        <Route path="booking" element={<BookingPage user={user} setUser={setUser} />} />
        <Route path="problems" element={<ProblemsPage user={user} setUser={setUser} />} />
        <Route path="roles" element={<RolesPage user={user} setUser={setUser}  />} />

      </Route>

      {/* Khi truy cập / → tự động chuyển hướng sang /login */}
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
<Toaster
        position="top-right"
        toastOptions={{
          duration: 2500,
          style: {
            fontSize: "15px",
            borderRadius: "10px",
            color: "#fff",
            padding: "12px 16px",
          },
          success: {
            style: {
              background: "linear-gradient(90deg, #7d6be6ff, #8e66e9ff)", // xanh lá
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#45be72ff",
            },
          },
          error: {
            style: {
              background: "linear-gradient(90deg, #da4b4bff, #c43d3dff)", // đỏ
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#dc2626",
            },
          },
          loading: {
            style: {
              background: "linear-gradient(90deg, #2563eb, #3b82f6)", // xanh dương
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#2563eb",
            },
          },
        }}
      />
 </>
  );
}

export default App;
