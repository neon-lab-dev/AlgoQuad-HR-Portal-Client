import WelcomeSection from "../../../components/Dashboard/DashboardPage/WelcomeSection/WelcomeSection";
import StatusCard from "../../../components/Dashboard/SharedComponents/StatusCard/StatusCard";
import StatusCardSkeleton from "../../../components/Dashboard/SharedComponents/StatusCard/StatusCardSkeleton";
import {
  FiBriefcase,
  FiUsers,
  FiAlertCircle,
  FiStar,
  FiClock,
  FiUserCheck,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";

const AdminDashboard = () => {
  // TODO: replace with real query when backend is ready
  const isLoading = false;
  const stats = {
    activeJobOpenings: 12,
    totalCandidates: 148,
    pendingActions: 7,
    newThisWeek: 23,
    statusSummary: {
      new: 45,
      screening: 32,
      interview: 18,
      selected: 9,
      rejected: 28,
      hired: 16,
    },
  };

  // Primary KPI cards (top row)
  const primaryCards = [
    {
      icon: <FiBriefcase size={28} />,
      value: stats?.activeJobOpenings,
      label: "Active Openings",
      badgeText: "Live",
      badgeBg: "bg-green-100",
      badgeBorder: "border-green-400",
      badgeTextColor: "text-green-600",
    },
    {
      icon: <FiUsers size={28} />,
      value: stats?.totalCandidates,
      label: "Total Candidates",
      badgeText: "All",
      badgeBg: "bg-blue-100",
      badgeBorder: "border-blue-400",
      badgeTextColor: "text-blue-600",
    },
    {
      icon: <FiAlertCircle size={28} />,
      value: stats?.pendingActions,
      label: "Pending Actions",
      badgeText: "Action",
      badgeBg: "bg-red-100",
      badgeBorder: "border-red-400",
      badgeTextColor: "text-red-600",
    },
    {
      icon: <FiStar size={28} />,
      value: stats?.newThisWeek,
      label: "New This Week",
      badgeText: "7d",
      badgeBg: "bg-purple-100",
      badgeBorder: "border-purple-400",
      badgeTextColor: "text-purple-600",
    },
  ];

  // Recruitment status summary (§3.2 - basic status summary)
  const statusCards = [
    {
      icon: <FiClock size={28} />,
      value: stats?.statusSummary?.new,
      label: "New",
      badgeText: "Status",
      badgeBg: "bg-slate-100",
      badgeBorder: "border-slate-400",
      badgeTextColor: "text-slate-600",
    },
    {
      icon: <FiUserCheck size={28} />,
      value: stats?.statusSummary?.screening,
      label: "Screening",
      badgeText: "Status",
      badgeBg: "bg-yellow-100",
      badgeBorder: "border-yellow-400",
      badgeTextColor: "text-yellow-600",
    },
    {
      icon: <FiUsers size={28} />,
      value: stats?.statusSummary?.interview,
      label: "Interview",
      badgeText: "Status",
      badgeBg: "bg-indigo-100",
      badgeBorder: "border-indigo-400",
      badgeTextColor: "text-indigo-600",
    },
    {
      icon: <FiCheckCircle size={28} />,
      value: stats?.statusSummary?.selected,
      label: "Selected",
      badgeText: "Status",
      badgeBg: "bg-teal-100",
      badgeBorder: "border-teal-400",
      badgeTextColor: "text-teal-600",
    },
    {
      icon: <FiXCircle size={28} />,
      value: stats?.statusSummary?.rejected,
      label: "Rejected",
      badgeText: "Status",
      badgeBg: "bg-red-100",
      badgeBorder: "border-red-400",
      badgeTextColor: "text-red-600",
    },
    {
      icon: <FiCheckCircle size={28} />,
      value: stats?.statusSummary?.hired,
      label: "Hired",
      badgeText: "Status",
      badgeBg: "bg-green-100",
      badgeBorder: "border-green-400",
      badgeTextColor: "text-green-600",
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <WelcomeSection />

      {/* Primary KPIs */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-gray-800">
          Recruitment Overview
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <StatusCardSkeleton key={i} />
              ))
            : primaryCards.map((item, index) => (
                <StatusCard
                  key={index}
                  icon={item.icon}
                  value={item.value}
                  label={item.label}
                  badgeText={item.badgeText}
                  badgeBg={item.badgeBg}
                  badgeBorder={item.badgeBorder}
                  badgeTextColor={item.badgeTextColor}
                />
              ))}
        </div>
      </div>

      {/* Recruitment Status Summary */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-gray-800">
          Candidate Status Summary
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <StatusCardSkeleton key={i} />
              ))
            : statusCards.map((item, index) => (
                <StatusCard
                  key={index}
                  icon={item.icon}
                  value={item.value}
                  label={item.label}
                  badgeText={item.badgeText}
                  badgeBg={item.badgeBg}
                  badgeBorder={item.badgeBorder}
                  badgeTextColor={item.badgeTextColor}
                />
              ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;