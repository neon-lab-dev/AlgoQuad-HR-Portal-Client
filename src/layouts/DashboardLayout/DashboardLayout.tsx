import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Dashboard/SharedComponents/Sidebar/Sidebar";
import HeaderDashboard from "../../components/Dashboard/SharedComponents/HeaderDashboard/HeaderDashboard";

const DashboardLayout = () => {
  return (
    <div className="flex w-full">
      <Sidebar />
      <div className="flex flex-col w-full">
        <HeaderDashboard />
        <div className="p-6 bg-neutral-135 min-h-screen flex flex-col">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;