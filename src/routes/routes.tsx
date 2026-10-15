import { createBrowserRouter } from "react-router-dom";
import NotFound from "../pages/NotFound/NotFound";
import DashboardLayout from "../layouts/DashboardLayout/DashboardLayout";
import AdminDashboard from "../pages/AdminDashboard/AdminDashboard/AdminDashboard";
import AdminProducts from "../pages/AdminDashboard/AdminProducts/AdminProducts";
import CourseDashboard from "../pages/AdminDashboard/CourseDashboard/CourseDashboard";
import ResetPassword from "../components/Auth/ResetPassword/ResetPassword";
import Newsletter from "../pages/AdminDashboard/Newsletter/Newsletter";
import AddOrEditProduct from "../pages/AdminDashboard/AddOrEditProduct/AddOrEditProduct";
import ManageCourseForm from "../pages/AdminDashboard/ManageCourseForm/ManageCourseForm";
import ManageLectures from "../pages/AdminDashboard/CourseDashboard/ManageLectures/ManageLectures";
import ManageConsultations from "../pages/AdminDashboard/ManageConsultations/ManageConsultations";
import ManageSubscriptions from "../pages/AdminDashboard/ManageSubscriptions/ManageSubscriptions";
import ProductOrders from "../pages/AdminDashboard/ProductOrders/ProductOrders";
import CourseOrders from "../pages/AdminDashboard/CourseOrders/CourseOrders";
import CouponCode from "../pages/AdminDashboard/CouponCode/CouponCode";
import ManageAvailability from "../pages/AdminDashboard/ManageAvailability/ManageAvailability";
import Queries from "../pages/AdminDashboard/Queries/Queries";
import ComingSoon from "../pages/ComingSoon/ComingSoon";
import ManageExam from "../pages/AdminDashboard/ManageExam/ManageExam";
import OfferNotice from "../pages/AdminDashboard/OfferNotice/OfferNotice";
import AuthLayout from "../layouts/AuthLayout/AuthLayout";
import Login from "../pages/Auth/Login/Login";
import Jobs from "../pages/AdminDashboard/Jobs/Jobs";
import Applications from "../pages/AdminDashboard/Applications/Applications";
import ApplicationDetails from "../pages/AdminDashboard/ApplicationDetails/ApplicationDetails";
import JobDetails from "../pages/AdminDashboard/JobDetails/JobDetails";
import AddOrEditJob from "../pages/AdminDashboard/AddOrEditJob/AddOrEditJob";

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
        path: "products",
        element: <AdminProducts />,
      },
      {
        path: "add-or-edit-product",
        element: <AddOrEditProduct />,
      },
      {
        path: "newsletter",
        element: <Newsletter />,
      },
      {
        path: "product-orders",
        element: <ProductOrders />,
      },
      {
        path: "offer-notice",
        element: <OfferNotice />,
      },
      {
        path: "course-orders",
        element: <CourseOrders />,
      },
      
      {
        path: "courses",
        element: <CourseDashboard />,
      },
      {
        path: "manage-course",
        element: <ManageCourseForm />,
      },
      {
        path: "course/manage-lectures/:id",
        element: <ManageLectures />,
      },
      {
        path: "manage-exam/:courseId",
        element: <ManageExam />,
      },
      {
        path: "manage-availability",
        element: <ManageAvailability />,
      },
      {
        path: "manage-consultations",
        element: <ManageConsultations />,
      },
      {
        path: "manage-coupon-codes",
        element: <CouponCode />,
      },
      {
        path: "manage-subscriptions",
        element: <ManageSubscriptions />,
      },
      {
        path: "queries",
        element: <Queries />,
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
