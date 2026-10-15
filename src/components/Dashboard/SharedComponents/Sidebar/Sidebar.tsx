import { Link, useLocation, useNavigate } from "react-router-dom";
import { ICONS } from "../../../../assets";
import { useDispatch, useSelector } from "react-redux";
import {
  logout,
  setUser,
  useCurrentUser,
} from "../../../../redux/Features/Auth/authSlice";
import type { TUser } from "../../../../types/user.types";
import Cookies from "js-cookie";
import { hrMenus } from "./sidebarMenus";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector(useCurrentUser) as TUser;
  console.log(user);
  const dispatch = useDispatch();
  const isActive = (path: string): boolean => location.pathname === path;

  // const sidebarLinks = user?.role === "hr" ? hrMenus : userMenus;
  const sidebarLinks = hrMenus;

  const handleLogout = async () => {
    dispatch(setUser({ user: null, token: null }));
    Cookies.remove("accessToken");
    Cookies.remove("role");
    dispatch(logout());
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="w-60 min-w-60 h-screen font-Inter hidden xl:flex flex-col justify-between sticky left-0 top-0 font-Montserrat overflow-auto">
      <div className="space-y-7">
        <Link
          to="/"
          className="flex items-center justify-center gap-2 w-full p-5 border-b border-b-neutral-98 border-r border-r-neutral-98 "
        >
          <img
            src={ICONS.logo}
            alt="AlgoQuad"
            className=""
          />
        </Link>
        <div className="px-4">
          <ul className="flex flex-col gap-2">
            {sidebarLinks?.map((menu) => (
              <li
                key={menu.link}
                className={`px-3 py-2 ${
                  isActive(menu.link)
                    ? "bg-primary-10/10 text-primary-10 font-semibold"
                    : "text-neutral-20 "
                } hover:bg-neutral-155 rounded-lg text-neutral-20 font-medium cursor-pointer transition duration-300 ease-in-out`}
              >
                <Link to={menu.link} className="flex items-center gap-3">
                  <menu.icon className="text-lg" /> {menu.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="rounded-xl mx-4 mb-6">
        <button
          onClick={handleLogout}
          className="hover:bg-primary-10/10 hover:text-primary-10 font-medium leading-[22px] w-full rounded-lg text-center flex items-center gap-2 justify-between py-2 px-3 cursor-pointer"
        >
          Logout
          <img
            src={ICONS.arrowLogout}
            alt="logout-icon"
            className="size-[18px]"
          />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
