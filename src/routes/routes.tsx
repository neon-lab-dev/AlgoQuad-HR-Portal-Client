import { createBrowserRouter } from "react-router-dom";
import NotFound from "../pages/NotFound/NotFound";
import DashboardLayout from "../layouts/DashboardLayout/DashboardLayout";
import AdminDashboard from "../pages/AdminDashboard/AdminDashboard/AdminDashboard";
import ResetPassword from "../components/Auth/ResetPassword/ResetPassword";
import ComingSoon from "../pages/ComingSoon/ComingSoon";
import AuthLayout from "../layouts/AuthLayout/AuthLayout";
import Login from "../pages/Auth/Login/Login";
import Jobs from "../pages/AdminDashboard/Jobs/Jobs";
import Applications from "../pages/AdminDashboard/Applications/Applications";
import ApplicationDetails from "../pages/AdminDashboard/ApplicationDetails/ApplicationDetails";
import JobDetails from "../pages/AdminDashboard/JobDetails/JobDetails";
import AddOrEditJob from "../pages/AdminDashboard/AddOrEditJob/AddOrEditJob";
import AddOrEditCandidate from "../pages/AdminDashboard/AddOrEditCandidate/AddOrEditCandidate";

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
