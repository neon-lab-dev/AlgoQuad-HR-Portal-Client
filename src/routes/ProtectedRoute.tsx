import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useCurrentUser } from "../redux/Features/Auth/authSlice";
import { useEffect, type ReactNode } from "react";
import type { TUser } from "../types/user.types";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const user = useSelector(useCurrentUser) as TUser;
  const location = useLocation();
  const path = location.pathname;

  // --- NEW: Save the last valid dashboard URL ---
  useEffect(() => {
    if (user && path.startsWith("/dashboard")) {
      sessionStorage.setItem("lastDashboardUrl", path);
    }
  }, [user, path]);

  // 1. If not logged in → redirect to login (Root path)
  if (!user) {
    if (path === "/") return <>{children}</>;
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // 2. If logged in → block access to the Root path (login page)
  if (path === "/") {
    // Grab their last visited URL from session storage
    const lastUrl = sessionStorage.getItem("lastDashboardUrl");

    // If they have a valid last URL that matches their role, send them back there
    if (lastUrl && lastUrl.startsWith(`/dashboard/${user.role === "hr" ? "hr" : user.role}`)) {
      return <Navigate to={lastUrl} replace />;
    }

    // Fallback: If no last URL exists, send to the default dashboard root
    if (user.role === "admin") return <Navigate to="/dashboard/admin" replace />;
    if (user.role === "hr") return <Navigate to="/dashboard/hr" replace />;
    return <Navigate to="/dashboard/employee" replace />;
  }

  // 3. Strict Role-Based Path Restrictions for /dashboard routes
  if (path.startsWith("/dashboard")) {
    // Admin can ONLY access /dashboard/admin/*
    if (user.role === "admin" && !path.startsWith("/dashboard/admin")) {
      return <Navigate to="/dashboard/admin" replace />;
    }

    // HR can ONLY access /dashboard/hr/*
    if (user.role === "hr" && !path.startsWith("/dashboard/hr")) {
      return <Navigate to="/dashboard/hr" replace />;
    }

    // Employee can ONLY access /dashboard/employee/*
    if (user.role === "employee" && !path.startsWith("/dashboard/employee")) {
      return <Navigate to="/dashboard/employee" replace />;
    }
  }

  // 4. Otherwise → allow
  return <>{children}</>;
};

export default ProtectedRoute;