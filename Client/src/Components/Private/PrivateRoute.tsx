import React from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: React.ReactElement; // dùng React.ReactElement thay cho JSX.Element
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const user = localStorage.getItem("user"); // kiểm tra user đã login chưa

  if (!user) {
    // chưa login → redirect về login
    return <Navigate to="/login" replace />;
  }

  // đã login → render component con
  return children;
};

export default PrivateRoute;
