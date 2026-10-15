/* eslint-disable @typescript-eslint/no-explicit-any */
import { FiCheckCircle, FiXCircle, FiLink, FiRefreshCw } from "react-icons/fi";
import DashboardContainer from "../../../components/Dashboard/SharedComponents/DashboardContainer/DashboardContainer";
import SearchInput from "../../../components/Reusable/SearchInput/SearchInput";
import Table from "../../../components/Reusable/Table/Table";
import { useState } from "react";
import type { TConsultation } from "../../../types/consultations.types";
import { formatDate } from "../../../utils/formatDate";
import {} from "react-icons/fi";
import Dropdown from "../../../components/Reusable/Dropdown/Dropdown";
import toast from "react-hot-toast";
import ConsultationsStats from "../../../components/AdminDashboard/ManageConsultationsPage/ConsultationsStats/ConsultationsStats";
import ScheduleMeetingModal from "../../../components/AdminDashboard/ManageConsultationsPage/ScheduleMeetingModal/ScheduleMeetingModal";
import ReScheduleMeetingModal from "../../../components/AdminDashboard/ManageConsultationsPage/ReScheduleMeetingModal/ReScheduleMeetingModal";
import { useGetAllConsultationsQuery, useUpdateStatusMutation } from "../../../redux/Features/ChatAndChill/chatAndChill";

const ManageConsultations = () => {
  const [bookingId, setBookingId] = useState<string>("");
  const [isScheduleMeetingModalOpen, setIsScheduleMeetingModalOpen] =
    useState<boolean>(false);
  const [isReScheduleMeetingModalOpen, setIsReScheduleMeetingModalOpen] =
    useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [searchValue, setSearchValue] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const { data, isLoading, isFetching } = useGetAllConsultationsQuery({
    keyword: searchValue,
    status: status,
    page: page,
  });

  const [updateStatus] = useUpdateStatusMutation();

  const allConsultations = data?.data?.bookings as TConsultation[];

  const allConsultationsData = allConsultations
    ?.map((consultation: TConsultation) => {
      const statusColors: Record<string, string> = {
        booked: "text-blue-600 bg-blue-100 border-blue-400",
        scheduled: "text-purple-600 bg-purple-100 border-purple-400",
        cancelled: "text-red-600 bg-red-100 border-red-400",
        completed: "text-green-600 bg-green-100 border-green-400",
      };

      const bookingDateObj = new Date(consultation.bookingDate);
      const today = new Date();
      const isToday = bookingDateObj.toDateString() === today.toDateString();

      return {
        ...consultation,
        _id: consultation._id,
        name: consultation.name,
        email: consultation.email,
        phoneNumber: consultation.phoneNumber,
        bookingDate: (
          <div className="flex items-center gap-2">
            <span>{formatDate(consultation.bookingDate)}</span>
            {isToday && (
              <span className="px-2 py-0.5 text-xs bg-orange-100 text-orange-700 rounded-full">
                Today
              </span>
            )}
          </div>
        ),
        status: (
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold border capitalize ${
              statusColors[consultation.status]
            }`}
          >
            {consultation.status === "booked"
              ? "Not Scheduled"
              : consultation.status}
          </span>
        ),
        meetingLink: (
          <a
            href={consultation.meetingLink}
            target="_blank"
            className="text-blue-600 hover:underline flex items-center gap-1"
          >
            {consultation?.meetingLink ? (
              <span className="flex items-center gap-1">
                <FiLink /> Join
              </span>
            ) : (
              "Not Scheduled yet"
            )}
          </a>
        ),
        topicsToDiscuss: consultation?.topicsToDiscuss
          ? consultation?.topicsToDiscuss!.length > 15
            ? consultation?.topicsToDiscuss!.slice(0, 15) + "..."
            : consultation.topicsToDiscuss
          : "N/A",
        bookingDateObj,
      };
    })
    // Sort: today's first, then latest booking first
    .sort((a, b) => {
      const today = new Date().toDateString();

      const aIsToday = a.bookingDateObj.toDateString() === today;
      const bIsToday = b.bookingDateObj.toDateString() === today;

      if (aIsToday && !bIsToday) return -1;
      if (!aIsToday && bIsToday) return 1;

      // Otherwise sort by latest booking first
      return (
        new Date(b.bookingDateObj).getTime() -
        new Date(a.bookingDateObj).getTime()
      );
    });

  // Columns
  const consultationColumns = [
    { key: "_id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phoneNumber", label: "Phone Number" },
    { key: "bookingDate", label: "Booking Date" },
    { key: "status", label: "Status" },
    { key: "meetingLink", label: "Meeting Link" },
    { key: "topicsToDiscuss", label: "Topics" },
  ];

  const handleUpdateStatus = async (status: string, id: string) => {
    const payload = {
      status,
    };
    try {
      await toast.promise(updateStatus({ data: payload, id }).unwrap(), {
        loading: "Updating status...",
        success: (res: any) => res?.message || "Status updated successfully!",
        error: (err: any) => err?.data?.message || "Something went wrong!",
      });
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  // Actions array
  const consultationActions = [
    {
      icon: <FiLink />,
      label: "Schedule Meeting",

      onClick: (row: any) => {
        setBookingId(row._id);
        setIsScheduleMeetingModalOpen(true);
      },
    },
    {
      icon: <FiRefreshCw />,
      label: "Re-Schedule",

      onClick: (row: any) => {
        setBookingId(row._id);
        setIsReScheduleMeetingModalOpen(true);
      },
    },
    {
      icon: <FiCheckCircle />,
      label: "Mark Completed",
      onClick: (row: any) => {
        handleUpdateStatus("completed", row?._id);
      },
      condition: (row: any) =>
        row.status.props.children !== "completed" &&
        row.status.props.children !== "cancelled",
    },
    {
      icon: <FiXCircle />,
      label: "Cancel",
      onClick: (row: any) => {
        handleUpdateStatus("cancelled", row?._id);
      },
      className: "text-red-600",
      condition: (row: any) =>
        row.status.props.children !== "completed" &&
        row.status.props.children !== "cancelled",
    },
  ];

  return (
    <div>
      {/* Status cards */}
      <ConsultationsStats allConsultations={allConsultations} />

      <DashboardContainer>
        <div className="font-Montserrat flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col lg:flex-row gap-5 lg:gap-0 justify-between items-start">
            <div>
              <h1 className="text-xl font-bold text-neutral-40">
                All Consultations
              </h1>
              <p className="text-neutral-65">Manage all one-to-one calls</p>
            </div>
            <div className="flex justify-between items-center gap-4 flex-wrap">
              {/* Filters */}
              <div className="flex items-center flex-wrap">
                <SearchInput
                  value={searchValue}
                  onChange={setSearchValue}
                  placeholder="Search by name, email, phone number..."
                />
                <Dropdown
                  className="py-1 px-3 w-60"
                  value={status}
                  onChange={setStatus}
                  options={[
                    { value: "", label: "All Status" },
                    { value: "booked", label: "Not Scheduled" },
                    { value: "scheduled", label: "Scheduled" },
                    { value: "cancelled", label: "Cancelled" },
                    { value: "completed", label: "Completed" },
                  ]}
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <Table
            columns={consultationColumns}
            data={allConsultationsData}
            actions={consultationActions}
            rowKey="_id"
            isLoading={isLoading || isFetching}
            page={page}
            totalPages={data?.data?.pagination?.totalPages}
            onPageChange={setPage}
          />
        </div>
      </DashboardContainer>

      <ScheduleMeetingModal
        bookingId={bookingId}
        isScheduleMeetingModalOpen={isScheduleMeetingModalOpen}
        setIsScheduleMeetingModalOpen={setIsScheduleMeetingModalOpen}
      />

      <ReScheduleMeetingModal
        bookingId={bookingId}
        isReScheduleMeetingModalOpen={isReScheduleMeetingModalOpen}
        setIsReScheduleMeetingModalOpen={setIsReScheduleMeetingModalOpen}
      />
    </div>
  );
};

export default ManageConsultations;
