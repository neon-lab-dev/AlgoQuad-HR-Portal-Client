import { ICONS } from "../../../../assets";
import { useGetMySubscriptionQuery } from "../../../../redux/Features/BoardroomBanter/boardroomBanterApi";
import { useGetMyBookingsQuery } from "../../../../redux/Features/ChatAndChill/chatAndChill";
import { useGetMyCourseOrdersQuery } from "../../../../redux/Features/CourseOrders/courseOrdersApi";
import type { TChatAndChill } from "../../../../types/chatAndChill.types";
import StatusCard from "../StatusCard/StatusCard";

const StatusSection = () => {
  const { data: courses } = useGetMyCourseOrdersQuery({});
  const { data: myBookings } = useGetMyBookingsQuery({});
   const { data:mySubscription } = useGetMySubscriptionQuery({});
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday (start of week)
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7); // next Sunday
  endOfWeek.setHours(23, 59, 59, 999);

  const thisWeeksBookings =
    myBookings?.data?.bookings?.filter((booking:TChatAndChill) => {
      const bookingDate = new Date(booking.bookingDate);
      return (
        booking.status === "scheduled" &&
        booking.meetingLink &&
        bookingDate >= startOfWeek &&
        bookingDate <= endOfWeek
      );
    }) ?? [];

  const cardsData = [
    {
      icon: ICONS.calendarMinimalistic,
      value: thisWeeksBookings.length || 0,
      label: "Upcoming Consultations",
      badgeText: "This Week",
      badgeBg: "bg-surface-40",
      badgeBorder: "border-surface-95",
      badgeTextColor: "text-surface-100",
    },
    {
      icon: ICONS.graduationCap,
      value: courses?.data?.orders?.length || 0,
      label: "Active Courses",
      badgeText: "In Progress",
      badgeBg: "bg-surface-40",
      badgeBorder: "border-surface-95",
      badgeTextColor: "text-surface-100",
    },
    {
      icon: ICONS.curatedConversations,
      value: mySubscription?.data?.status === "active" ? 1 : 0,
      label: "Private Group Access",
      badgeText: "This Month",
      badgeBg: "bg-blue-200",
      badgeBorder: "border-blue-500",
      badgeTextColor: "text-blue-500",
    },
  ];
  return (
    <div className="flex flex-col md:flex-row gap-4 w-full">
      {cardsData.map((card, index) => (
        <StatusCard key={index} {...card} />
      ))}
    </div>
  );
};

export default StatusSection;
