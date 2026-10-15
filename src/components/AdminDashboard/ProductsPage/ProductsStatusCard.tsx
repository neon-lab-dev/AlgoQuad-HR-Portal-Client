import StatusCard from "../../Dashboard/SharedComponents/StatusCard/StatusCard";
import { FiAlertCircle, FiCheckCircle, FiPackage } from "react-icons/fi";
const ProductsStatusCard = () => {
  return (
    <div className="w-full ">
      <div className="grid grid-cols-1 md:grid-cols-4 2xl:grid-cols-5 gap-4">
        {/* Total Products */}
        <StatusCard
          icon={<FiPackage size={28} />}
          value={120}
          label="Total Products"
          badgeText="All"
          badgeBg="bg-blue-100"
          badgeBorder="border-blue-400"
          badgeTextColor="text-blue-600"
        />

        {/* Active Products */}
        <StatusCard
          icon={<FiCheckCircle size={28} />}
          value={95}
          label="Available Products"
          badgeText="Live"
          badgeBg="bg-green-100"
          badgeBorder="border-green-400"
          badgeTextColor="text-green-600"
        />

        {/* Out of Stock */}
        <StatusCard
          icon={<FiAlertCircle size={28} />}
          value={25}
          label="Out of Stock"
          badgeText="Low Stock"
          badgeBg="bg-red-100"
          badgeBorder="border-red-400"
          badgeTextColor="text-red-600"
        />
      </div>
    </div>
  );
};

export default ProductsStatusCard;
