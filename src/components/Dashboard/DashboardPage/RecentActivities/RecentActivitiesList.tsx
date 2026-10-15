import DashboardContainer from "../../SharedComponents/DashboardContainer/DashboardContainer";
import React from "react";
import RecentActivitiesCard from "./RecentActivitiesCard/RecentActivitiesCard";
import { ICONS } from "../../../../assets";
import { useGetMyActivityQuery } from "../../../../redux/Features/User/userApi";
import { formatDate } from "../../../../utils/formatDate";
import type { TActivity } from "../../../../types/activities.types";
import { FiActivity } from "react-icons/fi";
import Loader from "../../../Shared/Loader/Loader";

const RecentActivitiesList: React.FC = () => {
  const { data, isLoading } = useGetMyActivityQuery({});

  const activities = data?.data?.activities
    ? [...data.data.activities].reverse()
    : [];

  return (
    <DashboardContainer
      headerText="Recent Activities"
      btn="View All"
      btnLink="recent-activities"
    >
      {isLoading ? (
        <div className="text-center py-10"><Loader/></div>
      ) : activities?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-gray-500">
          <FiActivity className="text-4xl mb-4" />
          <p>No recent activities found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities?.map((activity: TActivity, index: number) => (
            <RecentActivitiesCard
              key={index}
              icon={ICONS.email}
              title={activity.title}
              description={activity.description}
              date={formatDate(activity.createdAt)}
            />
          ))}
        </div>
      )}
    </DashboardContainer>
  );
};

export default RecentActivitiesList;
