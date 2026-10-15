import type { TConsultation } from "../../../../types/consultations.types";
import { formatDate } from "../../../../utils/formatDate";
import StatusCard from "../../../Dashboard/SharedComponents/StatusCard/StatusCard";
import {
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiUser,
} from "react-icons/fi";
const ConsultationsStats = ({allConsultations} : {allConsultations: TConsultation[]}) => {

    const scheduled = allConsultations?.filter(
        (consultation: TConsultation) => consultation.status === "scheduled"
      );
      const completed = allConsultations?.filter(
        (consultation: TConsultation) => consultation.status === "completed"
      );
      const cancelled = allConsultations?.filter(
        (consultation: TConsultation) => consultation.status === "cancelled"
      );
      const todaysConsultations = allConsultations?.filter(
        (consultation: TConsultation) =>
          consultation.status === "scheduled" &&
          formatDate(consultation.bookingDate) === formatDate(new Date())
      );
    
      const stats = {
        total: allConsultations?.length || 0,
        scheduled: scheduled?.length || 0,
        completed: completed?.length || 0,
        cancelled: cancelled?.length || 0,
        todaysConsultations: todaysConsultations?.length || 0,
      };
    return (
       <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-5">
        {/* Total Consultations */}
        <StatusCard
          icon={<FiCalendar size={28} />}
          value={stats?.total}
          label="Total Consultations"
          badgeText="All"
          badgeBg="bg-blue-100"
          badgeBorder="border-blue-400"
          badgeTextColor="text-blue-600"
        />

        {/* Scheduled Consultations */}
        <StatusCard
          icon={<FiClock size={28} />}
          value={stats?.scheduled}
          label="Scheduled"
          badgeText="Upcoming"
          badgeBg="bg-yellow-100"
          badgeBorder="border-yellow-400"
          badgeTextColor="text-yellow-600"
        />

        {/* Completed Consultations */}
        <StatusCard
          icon={<FiCheckCircle size={28} />}
          value={stats?.completed}
          label="Completed"
          badgeText="Done"
          badgeBg="bg-green-100"
          badgeBorder="border-green-400"
          badgeTextColor="text-green-600"
        />

        {/* Cancelled Consultations */}
        <StatusCard
          icon={<FiXCircle size={28} />}
          value={stats?.cancelled}
          label="Cancelled"
          badgeText="Cancelled"
          badgeBg="bg-red-100"
          badgeBorder="border-red-400"
          badgeTextColor="text-red-600"
        />

        {/* Consultations Today */}
        <StatusCard
          icon={<FiUser size={28} />}
          value={stats?.todaysConsultations}
          label="Today’s Consultations"
          badgeText="Today"
          badgeBg="bg-purple-100"
          badgeBorder="border-purple-400"
          badgeTextColor="text-purple-600"
        />
      </div>
    );
};

export default ConsultationsStats;