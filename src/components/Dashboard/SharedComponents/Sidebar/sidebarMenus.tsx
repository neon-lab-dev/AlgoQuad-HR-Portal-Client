import {
  FiHome,
  FiMail,
  FiUsers,
  FiUser,
} from "react-icons/fi";

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
    name: "Jobs",
    link: "/dashboard/employee/jobs",
    icon: FiMail,
  },
];
