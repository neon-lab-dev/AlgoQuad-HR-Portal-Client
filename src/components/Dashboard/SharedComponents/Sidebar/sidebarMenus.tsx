import {
  FiHome,
  FiMail,
  FiBookOpen,
  FiUserCheck,
  FiUsers,
  FiUser,
  FiShoppingBag,
  FiHelpCircle,
} from "react-icons/fi";

export const userMenus = [
  { name: "Dashboard", link: "/dashboard", icon: FiHome },
  {
    name: "My Courses",
    link: "/dashboard/my-courses",
    icon: FiBookOpen,
  },
  {
    name: "My Orders",
    link: "/dashboard/my-orders",
    icon: FiShoppingBag,
  },
  {
    name: "Consultations",
    link: "/dashboard/consultations",
    icon: FiUserCheck,
  },
  {
    name: "My Subscriptions",
    link: "/dashboard/my-subscriptions",
    icon: FiUsers,
  },
  {
    name: "Help Desk",
    link: "/dashboard/helpdesk",
    icon: FiHelpCircle,
  },
  {
    name: "My Profile",
    link: "/dashboard/certificates",
    icon: FiUser,
  },
];

export const hrMenus = [
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
