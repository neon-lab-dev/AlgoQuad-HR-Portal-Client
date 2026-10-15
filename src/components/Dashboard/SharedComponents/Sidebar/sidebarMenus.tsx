import {
  FiHome,
  FiMail,
  // FiBox,
  // FiShoppingCart,
  FiBookOpen,
  FiUserCheck,
  FiUsers,
  // FiKey,
  FiUser,
  FiShoppingBag,
  FiHelpCircle,
} from "react-icons/fi";
// import { AiOutlineCheckCircle, AiOutlineTag } from "react-icons/ai";
// import { HiOutlineMegaphone } from "react-icons/hi2";

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
  // {
  //   name: "Category",
  //   link: "/dashboard/admin/category",
  //   icon: AiOutlineTag,
  // },
  // {
  //   name: "Products",
  //   link: "/dashboard/admin/products",
  //   icon: FiBox,
  // },
  // {
  //   name: "Product Orders",
  //   link: "/dashboard/admin/product-orders",
  //   icon: FiShoppingCart,
  // },
  // {
  //   name: "Offer Notice",
  //   link: "/dashboard/admin/offer-notice",
  //   icon: HiOutlineMegaphone,
  // },
  // {
  //   name: "Course Orders",
  //   link: "/dashboard/admin/course-orders",
  //   icon: FiBookOpen,
  // },
  // {
  //   name: "Courses",
  //   link: "/dashboard/admin/courses",
  //   icon: FiBookOpen,
  // },
  // {
  //   name: "Availability",
  //   link: "/dashboard/admin/manage-availability",
  //   icon: AiOutlineCheckCircle,
  // },
  // {
  //   name: "Consultations",
  //   link: "/dashboard/admin/manage-consultations",
  //   icon: FiUserCheck,
  // },
  // {
  //   name: "Subscriptions",
  //   link: "/dashboard/admin/manage-subscriptions",
  //   icon: FiUsers,
  // },
  // {
  //   name: "Coupon Code",
  //   link: "/dashboard/admin/manage-coupon-codes",
  //   icon: FiKey,
  // },
  // {
  //   name: "Queries",
  //   link: "/dashboard/admin/queries",
  //   icon: FiHelpCircle,
  // },
];
