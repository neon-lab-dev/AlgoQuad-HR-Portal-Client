import { ICONS } from "../../../../assets";
import DashboardContainer from "../../SharedComponents/DashboardContainer/DashboardContainer";
import SubscriptionQuickCard from "../SubscriptionQuickCards/SubscriptionQuickCards";

const SubscriptionQuickList = () => {
  const quickActions = [
    // {
    //   icon: ICONS.pauseCircle,
    //   title: "Pause Subscription",
    //   subTitle: "Temporarily pause your subscription",
    //   description:
    //     "A request will be raised to the team to hold your whatsapp group access until a selected date",
    //   path: "/dashboard/pause-subscription",
    // },
    {
      icon: ICONS.grayCross,
      title: "Cancel Subscription",
      subTitle: "End your subscription permanently",
      description:
        "A request will be raised to the team to terminate  your whatsapp group permanently",
      path: "/dashboard/cancel-subscription",
    },
  ];

  return (
    <DashboardContainer headerText="Quick Actions">
      <div className="space-y-4">
        {quickActions.map((action, index) => (
          <SubscriptionQuickCard
            key={index}
            icon={action.icon}
            title={action.title}
            subTitle={action.subTitle}
            description={action.description}
            path={action.path}
          />
        ))}
      </div>
    </DashboardContainer>
  );
};

export default SubscriptionQuickList;
