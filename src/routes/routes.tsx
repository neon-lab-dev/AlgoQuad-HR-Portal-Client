import { createBrowserRouter } from "react-router-dom";
import NotFound from "../pages/NotFound/NotFound";
import DashboardLayout from "../layouts/DashboardLayout/DashboardLayout";
import AdminDashboard from "../pages/AdminDashboard/JobManagement/AdminDashboard/AdminDashboard";
import ComingSoon from "../pages/ComingSoon/ComingSoon";
import AuthLayout from "../layouts/AuthLayout/AuthLayout";
import Login from "../pages/Auth/Login/Login";
import Jobs from "../pages/AdminDashboard/JobManagement/Jobs/Jobs";
import Applications from "../pages/AdminDashboard/JobManagement/Applications/Applications";
import ApplicationDetails from "../pages/AdminDashboard/JobManagement/ApplicationDetails/ApplicationDetails";
import JobDetails from "../pages/AdminDashboard/JobManagement/JobDetails/JobDetails";
import AddOrEditJob from "../pages/AdminDashboard/JobManagement/AddOrEditJob/AddOrEditJob";
import AddOrEditCandidate from "../pages/AdminDashboard/JobManagement/AddOrEditCandidate/AddOrEditCandidate";
import Employees from "../pages/AdminDashboard/EmployeeManagement/Employees/Employees";
import EmployeeProfile from "../pages/AdminDashboard/EmployeeManagement/Employees/EmployeeProfile/EmployeeProfile";
import AddOrEditEmployee from "../pages/AdminDashboard/EmployeeManagement/AddOrEditEmployee/AddOrEditEmployee";
import MyProfile from "../pages/AdminDashboard/MyProfile/MyProfile";
import ResetPassword from "../pages/Auth/ResetPassword/ResetPassword";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/",
        element: <Login />,
      },
      {
        path: "/coming-soon",
        element: <ComingSoon />,
      },
    ],
  },
  // {
  //   path: "dashboard",
  //   element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
  //   errorElement: <NotFound />,
  //   children: [
  //     {
  //       path: "",
  //       element: <Dashboard />,
  //     },
  //   ],
  // },
  {
    path: "dashboard/admin",
    // element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    element: <DashboardLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "",
        element: <AdminDashboard />,
      },
      {
        path: "jobs",
        element: <Jobs />,
      },
      {
        path: "job/:id",
        element: <JobDetails />,
      },
      {
        path: "jobs/create",
        element: <AddOrEditJob />,
      },
      {
        path: "job/edit/:id",
        element: <AddOrEditJob />,
      },
      {
        path: "applications/:jobId",
        element: <Applications />,
      },
      {
        path: "application/:id",
        element: <ApplicationDetails />,
      },
      {
        path: "candidate/add/:jobId",
        element: <AddOrEditCandidate />,
      },
      // {
      //   path: "candidate/edit/:id",
      //   element: <AddOrEditCandidate />,
      // },
      {
        path: "employees",
        element: <Employees />,
      },
      {
        path: "employee/:id",
        element: <EmployeeProfile />,
      },
      {
        path: "employee/add",
        element: <AddOrEditEmployee />,
      },
      {
        path: "employee/edit/:id",
        element: <AddOrEditEmployee />,
      },
      {
        path: "me",
        element: <MyProfile />,
      },
    ],
  },
  {
    path: "dashboard/hr",
    // element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    element: <DashboardLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "",
        element: <AdminDashboard />,
      },
      {
        path: "jobs",
        element: <Jobs />,
      },
      {
        path: "job/:id",
        element: <JobDetails />,
      },
      {
        path: "jobs/create",
        element: <AddOrEditJob />,
      },
      {
        path: "job/edit/:id",
        element: <AddOrEditJob />,
      },
      {
        path: "applications/:jobId",
        element: <Applications />,
      },
      {
        path: "application/:id",
        element: <ApplicationDetails />,
      },
      {
        path: "candidate/add/:jobId",
        element: <AddOrEditCandidate />,
      },
      // {
      //   path: "candidate/edit/:id",
      //   element: <AddOrEditCandidate />,
      // },
      {
        path: "employees",
        element: <Employees />,
      },
      {
        path: "employee/:id",
        element: <EmployeeProfile />,
      },
      {
        path: "employee/add",
        element: <AddOrEditEmployee />,
      },
      {
        path: "employee/edit/:id",
        element: <AddOrEditEmployee />,
      },
      {
        path: "me",
        element: <MyProfile />,
      },
    ],
  },
  {
    path: "admin",
    element: <Login />,
  },
  {
    path: "reset-password",
    element: <ResetPassword />,
  },
]);
