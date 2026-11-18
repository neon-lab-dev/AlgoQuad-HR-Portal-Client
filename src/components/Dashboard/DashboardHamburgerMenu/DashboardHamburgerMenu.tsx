import { Link, useLocation, useNavigate } from "react-router-dom";
import { ICONS } from "../../../assets";
import { useEffect, useState } from "react";
import { adminMenus, employeeMenus, hrMenus } from "../SharedComponents/Sidebar/sidebarMenus";
import { useDispatch, useSelector } from "react-redux";
import { logout, setUser, useCurrentUser } from "../../../redux/Features/Auth/authSlice";
import type { TUser } from "../../../types/user.types";
import Cookies from "js-cookie";

const DashboardHamburgerMenu = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(useCurrentUser) as TUser;
  
  const sidebarLinks =
    user?.role === "hr"
      ? hrMenus
      : user?.role === "admin"
        ? adminMenus
        : employeeMenus;
        
  const isActive = (path: string): boolean => location.pathname === path;
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);

  const toggleHamburgerMenu = () => {
    setIsHamburgerOpen(!isHamburgerOpen);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const closestDropdown = target.closest(".hamburgerMenu");
      if (isHamburgerOpen && closestDropdown === null) {
        setIsHamburgerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isHamburgerOpen]);

  const handleLogout = async () => {
    dispatch(setUser({ user: null, token: null }));
    Cookies.remove("accessToken");
    Cookies.remove("role");
    dispatch(logout());
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="relative hamburgerMenu flex xl:hidden">
      <button onClick={toggleHamburgerMenu} className="size-7 cursor-pointer">
        <img src={ICONS.menu} alt="menu-icon" />
      </button>

      {/* Background Overlay */}
      <div
        onClick={toggleHamburgerMenu}
        className={`fixed inset-0 bg-black z-50 transition-opacity duration-300 ${
          isHamburgerOpen ? "opacity-50" : "opacity-0 pointer-events-none"
        }`}
      ></div>

           {/* Side Menu */}
      <div
        className={`fixed inset-y-0 left-0 z-50 bg-white shadow-xl border-r border-neutral-200 px-4 py-6 w-[280px] overflow-y-auto transition-all duration-300 transform flex flex-col justify-between ${
          isHamburgerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-6">
          {/* Logo & Close Button Section */}
          <div className="relative flex items-center justify-between w-full pb-5 border-b border-neutral-100">
            {/* Added max-h to ensure logo doesn't blow up */}
            <img src={ICONS.logo} alt="AlgoQuad" className="max-w-[170px] object-contain" />
            
            {/* Close Button */}
            <button 
              onClick={toggleHamburgerMenu} 
              className="text-neutral-400 hover:text-neutral-800 p-1 cursor-pointer transition-colors"
              aria-label="Close menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Links Section */}
          <div>
            <ul className="flex flex-col gap-1">
              {sidebarLinks?.map((menu) => (
                <Link
                  to={menu.link}
                  key={menu.link}
                  onClick={() => setIsHamburgerOpen(false)}
                  // CHANGED: Added text-sm to force smaller text, and text-[15px] if you want something in between
                  className={`px-3 py-2.5 text-[15px] ${
                    isActive(menu.link)
                      ? "bg-primary-10/10 text-primary-10 font-semibold"
                      : "text-neutral-600 font-medium"
                  } hover:bg-neutral-100 rounded-lg cursor-pointer transition duration-300 ease-in-out flex items-center gap-3`}
                >
                  {/* CHANGED: Reduced icon size to text-base */}
                  <menu.icon className="text-base shrink-0" /> 
                  <span className="truncate">{menu.name}</span>
                </Link>
              ))}
            </ul>
          </div>
        </div>

        {/* Logout Section */}
        <div className="mb-2">
          <button
            onClick={handleLogout}
            className="hover:bg-primary-10/10 hover:text-primary-10 text-neutral-600 font-medium text-[15px] leading-[22px] w-full rounded-lg flex items-center gap-2 justify-between py-2 px-3 cursor-pointer transition-colors"
          >
            Logout
            <img
              src={ICONS.arrowLogout}
              alt="logout-icon"
              className="size-[16px] shrink-0"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHamburgerMenu;