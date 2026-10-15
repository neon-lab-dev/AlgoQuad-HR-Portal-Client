import { ICONS } from "../../../../assets";
import DashboardContainer from "../../SharedComponents/DashboardContainer/DashboardContainer";
import QuickActionCard from "./QuickActionCard/QuickActionCard";

const quickActions = [
  {
    icon: ICONS.email,
    title: "Chat & Chill",
    description: "Book 1 on 1 meet",
    link:"/dashboard/consultations"
  },
  {
    icon: ICONS.author,
    title: "Boardroom Banter",
    description: "WhatsApp group awaits you here",
       link:"/dashboard/my-subscriptions"
  },
  {
    icon: ICONS.bell,
    title: "Brain Games",
    description: "Browse our courses",
       link:"/dashboard/my-courses"
  },
];

const QuickActionsList = () => {
  return (
    <DashboardContainer headerText="User Dashboard">
      <div className="space-y-4">
        {quickActions.map((action, index) => (
          <QuickActionCard
            key={index}
            icon={action.icon}
            title={action.title}
            description={action.description}
            link={action.link}
          />
        ))}
      </div>
    </DashboardContainer>
  );
};

export default QuickActionsList;
