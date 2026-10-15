import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useCurrentUser } from "../redux/Features/Auth/authSlice";
import type { ReactNode } from "react";
import type { TUser } from "../types/user.types";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const user = useSelector(useCurrentUser) as TUser;
  const location = useLocation();
  const path = location.pathname;

  // 1. If not logged in → redirect to home
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // 2. If role is admin → block /dashboard root
  if (user.role === "hr" && path === "/dashboard") {
    return <Navigate to="/dashboard/admin" replace />;
  }

  // 3. If role is user → block /dashboard/admin/*
  if (user.role === "user" && path.startsWith("/dashboard/admin")) {
    return <Navigate to="/" replace />;
  }

  // 4. Otherwise → allow
  return <>{children}</>;
};

export default ProtectedRoute;
