/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useLocation } from "react-router-dom";
import { ICONS } from "../../../assets";
import { useEffect, useState } from "react";
import { TbLogout2 } from "react-icons/tb";
import { userMenus } from "../SharedComponents/Sidebar/sidebarMenus";

const DashboardHamburgerMenu = () => {
  const location = useLocation();
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
  return (
    <div className="relative hamburgerMenu flex xl:hidden">
      <button
        onClick={toggleHamburgerMenu}
        className="size-7 cursor-pointer"
      >
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
        className={`fixed inset-y-0 left-0 z-50 bg-primary-10 py-8 p-6 w-[250px] overflow-y-auto transition-all duration-300 transform flex flex-col gap-4 items-start justify-between ${
          isHamburgerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >

        <hr className="border border-neutral-50/30 w-full" />

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            {userMenus?.map((link:any) => (
              <Link
                key={link?.name}
                to={link?.link}
                onClick={toggleHamburgerMenu}
                className={`flex items-center gap-2 rounded-lg p-2 transform transition-transform duration-500 hover:-translate-y-1 ${
                  location?.pathname === link?.link
                    ? "bg-white text-primary-10 font-semibold"
                    : "font-medium  text-white  bg-none"
                }`}
              >
                <div className="size-6 rounded-full flex items-center justify-center bg-primary-10 text-white">
                  {link?.icon}
                </div>
                {link?.name}
              </Link>
            ))}
          </div>
        </div>

        <button
          className={`text-lg flex items-center gap-2 rounded-lg p-2 transform transition-transform duration-500 hover:-translate-y-1 text-white font-semibold cursor-pointer`}
        >
          <TbLogout2 className="text-xl" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default DashboardHamburgerMenu;
