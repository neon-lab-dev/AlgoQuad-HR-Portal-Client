import { Link } from "react-router-dom";
import { ICONS } from "../../../../assets";
import { useSelector } from "react-redux";
import { useCurrentUser } from "../../../../redux/Features/Auth/authSlice";
import type { TUser } from "../../../../types/user.types";
import { useEffect, useState } from "react";
import DashboardHamburgerMenu from "../../DashboardHamburgerMenu/DashboardHamburgerMenu";

const HeaderDashboard = () => {
  const user = useSelector(useCurrentUser) as TUser;

  // Real-time date state
  const [currentDate, setCurrentDate] = useState<string>(
    new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(
        new Date().toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
      );
    }, 1000 * 60);

    return () => clearInterval(interval);
  }, []);

  const profilePath = user?.role === "hr" ? "/dashboard/hr/me" : "/dashboard/employee/me";

  return (
    <div className="bg-white p-6 border-b border-b-neutral-98 text-3xl flex justify-between items-center pr-4 sticky top-0 z-20 font-Montserrat">
      <DashboardHamburgerMenu />
      <div className="text-neutral-20 space-y-1 hidden xl:flex flex-col">
        <h2 className="font-medium text-2xl">Good Morning, {user?.name}</h2>
        <span className="text-[13px]">{currentDate}</span>
      </div>
      <ul className="flex gap-5">
        <li>
          <Link to={profilePath}>
            <img src={ICONS.user} className="size-6" />
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default HeaderDashboard;
