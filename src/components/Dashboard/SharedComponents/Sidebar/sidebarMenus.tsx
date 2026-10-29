import { FiHome, FiMail, FiUsers, FiUser } from "react-icons/fi";
import { HiOutlineCalendarDays } from "react-icons/hi2";

export const hrMenus = [
  { name: "Dashboard", link: "/dashboard/hr", icon: FiHome },
  {
    name: "Jobs",
    link: "/dashboard/hr/jobs",
    icon: FiMail,
  },
  {
    name: "Employees",
    link: "/dashboard/hr/employees",
    icon: FiUsers,
  },
  {
    name: "My Timesheet",
    link: "/dashboard/hr/timesheet",
    icon: HiOutlineCalendarDays,
  },
  {
    name: "Team Timesheet",
    link: "/dashboard/hr/team-timesheet",
    icon: HiOutlineCalendarDays,
  },
  // {
  //   name: "Queries",
  //   link: "/dashboard/hr/queries",
  //   icon: FiHelpCircle,
  // },
];

export const adminMenus = [
  { name: "Dashboard", link: "/dashboard/admin", icon: FiHome },
  {
    name: "Jobs",
    link: "/dashboard/admin/jobs",
    icon: FiMail,
  },
  {
    name: "Employees",
    link: "/dashboard/admin/employees",
    icon: FiUsers,
  },
  {
    name: "Team Timesheet",
    link: "/dashboard/admin/team-timesheet",
    icon: HiOutlineCalendarDays,
  },
  // {
  //   name: "Queries",
  //   link: "/dashboard/admin/queries",
  //   icon: FiHelpCircle,
  // },
];

export const employeeMenus = [
  {
    name: "My Profile",
    link: "/dashboard/employee/me",
    icon: FiUser,
  },
  {
    name: "My Timesheet",
    link: "/dashboard/employee/timesheet",
    icon: HiOutlineCalendarDays,
  },

  {
    name: "Jobs",
    link: "/dashboard/employee/jobs",
    icon: FiMail,
  },
];
