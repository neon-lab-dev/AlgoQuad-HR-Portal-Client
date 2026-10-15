import StatusCard from "../../Dashboard/SharedComponents/StatusCard/StatusCard";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiPackage,
  FiXCircle,
} from "react-icons/fi";
import type { TProductOrder } from "../../../types/productOrder.types";


const OrderStatusCards = ({allProductOrders} : {allProductOrders:TProductOrder[]}) => {

  const pending = allProductOrders?.filter((productOrder:TProductOrder) => productOrder.status === "pending")?.length || 0;
  const shipped = allProductOrders.filter((productOrder:TProductOrder) => productOrder.status === "shipped")?.length || 0;
  const cancelled = allProductOrders.filter((productOrder:TProductOrder) => productOrder.status === "cancelled")?.length || 0;

  return (
    <div className="w-full ">
      {/* Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Orders */}
        <StatusCard
          icon={<FiPackage size={28} />}
          value={allProductOrders?.length || 0}
          label="Total Orders"
          badgeText="All"
          badgeBg="bg-blue-100"
          badgeBorder="border-blue-400"
          badgeTextColor="text-blue-600"
        />

        {/* Pending Orders */}
        <StatusCard
          icon={<FiAlertCircle size={28} />}
          value={pending}
          label="Pending Orders"
          badgeText="Pending"
          badgeBg="bg-yellow-100"
          badgeBorder="border-yellow-400"
          badgeTextColor="text-yellow-600"
        />

        {/* Delivered Orders */}
        <StatusCard
          icon={<FiCheckCircle size={28} />}
          value={shipped}
          label="Shipped Orders"
          badgeText="Shipped"
          badgeBg="bg-green-100"
          badgeBorder="border-green-400"
          badgeTextColor="text-green-600"
        />

        {/* Cancelled Orders */}
        <StatusCard
          icon={<FiXCircle size={28} />}
          value={cancelled}
          label="Cancelled Orders"
          badgeText="Cancelled"
          badgeBg="bg-red-100"
          badgeBorder="border-red-400"
          badgeTextColor="text-red-600"
        />
      </div>
    </div>
  );
};

export default OrderStatusCards;
