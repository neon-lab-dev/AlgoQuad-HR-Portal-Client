import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Dashboard/SharedComponents/Sidebar/Sidebar";
import HeaderDashboard from "../../components/Dashboard/SharedComponents/HeaderDashboard/HeaderDashboard";

const DashboardLayout = () => {
  return (
    <div className="flex w-full">
      <Sidebar />

      <div className="flex flex-col w-full min-w-0">
        <HeaderDashboard />

        <div
          className={`flex-1 overflow-y-auto overflow-x-hidden p-6 bg-neutral-135`}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;