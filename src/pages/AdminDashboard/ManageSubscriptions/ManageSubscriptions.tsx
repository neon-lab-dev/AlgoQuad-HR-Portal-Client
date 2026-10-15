/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  useGetAllSubscriptionsQuery,
  useSendCouponCodeMutation,
  useSuspendUserMutation,
  useUpdateWhatsAppStatusMutation,
  useWithdrawSuspensionMutation,
} from "../../../redux/Features/BoardroomBanter/boardroomBanterApi";
import type { TBoardRoomBanterSubscription } from "../../../types/boardroomBanter.types";
import { formatDate } from "../../../utils/formatDate";
import { FiEye, FiPauseCircle, FiUsers } from "react-icons/fi";
import DashboardContainer from "../../../components/Dashboard/SharedComponents/DashboardContainer/DashboardContainer";
import SearchInput from "../../../components/Reusable/SearchInput/SearchInput";
import Dropdown from "../../../components/Reusable/Dropdown/Dropdown";
import Table from "../../../components/Reusable/Table/Table";
import toast from "react-hot-toast";
import Button from "../../../components/Reusable/Button/Button";
import { RiCoupon3Line } from "react-icons/ri";
import { useForm } from "react-hook-form";
import ConfirmationModal from "../../../components/ConfirmationModal/ConfirmationModal";
import TextInput from "../../../components/Reusable/TextInput/TextInput";
import SubscriptionPreviewModal from "../../../components/AdminDashboard/ManageSubscriptionsPage/SubscriptionPreviewModal/SubscriptionPreviewModal";

type TFormData = {
  subscriptionId: string;
  email: string;
  couponCode: string;
};
const ManageSubscriptions = () => {
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSendCouponCodeModalOpen, setIsCouponCodeModalOpen] =
    useState<boolean>(false);
  const [subscriptionId, setSubscriptionId] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const [selectedSubscription, setSelectedSubscription] = useState<TBoardRoomBanterSubscription | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TFormData>();
  const [page, setPage] = useState<number>(1);
  const [searchValue, setSearchValue] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const { data, isLoading, isFetching } = useGetAllSubscriptionsQuery({
    keyword: searchValue,
    status: status,
    page: page,
  });

  const allSubscriptions = data?.data
    ?.subscriptions as TBoardRoomBanterSubscription[];

  const [updateWhatsAppStatus] = useUpdateWhatsAppStatusMutation();
  const [suspendUser] = useSuspendUserMutation();
  const [withdrawSuspension] = useWithdrawSuspensionMutation();

  const handleUpdateWhatsAppStatus = async (
    isAdded: boolean,
    userId: string
  ) => {
    try {
      const payload = {
        isAddedToWhatsappGroup: isAdded,
        userId,
      };

      await toast.promise(updateWhatsAppStatus(payload).unwrap(), {
        loading: "Updating status...",
        success: (res: any) => res?.message || "Status updated successfully!",
        error: (err: any) => err?.data?.message || "Something went wrong!",
      });
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  const handleUpdateSuspendedStatus = async (
    userId: string,
    isSuspended: boolean
  ) => {
    try {
      const actionPromise = isSuspended
        ? withdrawSuspension(userId).unwrap()
        : suspendUser(userId).unwrap();

      await toast.promise(actionPromise, {
        loading: "Updating suspension status...",
        success: (res: any) => res?.message || "Status updated successfully!",
        error: (err: any) => err?.data?.message || "Something went wrong!",
      });
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  const statusColors: Record<string, string> = {
    active: "text-green-600 bg-green-100 border-green-400",
    paused: "text-yellow-600 bg-yellow-100 border-yellow-400",
    expired: "text-red-600 bg-red-100 border-red-400",
    pending: "text-blue-600 bg-blue-100 border-blue-400",
    waitlist: "text-purple-600 bg-purple-100 border-purple-400",
    "code sent": "text-indigo-600 bg-indigo-100 border-indigo-400",
    cancelled: "text-red-600 bg-red-50 border-red-50",
  };

  const allSubscriptionsData = allSubscriptions
    ?.filter(
      (subscription: TBoardRoomBanterSubscription) =>
        subscription.status !== "waitlist"
    )
    ?.map((subscription: TBoardRoomBanterSubscription) => {
      return {
        _id: subscription._id,
        name: subscription.name,
        email: subscription.email,
        phoneNumber: subscription.phoneNumber,
        date: subscription?.startDate
          ? `${formatDate(subscription.startDate)} - ${formatDate(
              subscription.endDate
            )}`
          : "N/A",
        status: (
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold border capitalize ${
              statusColors[subscription.status]
            }`}
          >
            {subscription.status}
          </span>
        ),
        whatsappGroup: (
          <button
            className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs cursor-pointer disabled:cursor-not-allowed"
            onClick={() =>
              handleUpdateWhatsAppStatus(
                !subscription.isAddedToWhatsappGroup,
                subscription._id
              )
            }
            disabled={subscription.status === "code sent"}
          >
            <FiUsers />
            {subscription.isAddedToWhatsappGroup
              ? "Mark as Removed from Group"
              : "Mark as Added to Group"}
          </button>
        ),
        suspend: (
          <button
            className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs cursor-pointer disabled:cursor-not-allowed"
            onClick={() =>
              handleUpdateSuspendedStatus(
                subscription?._id,
                subscription?.isSuspended ?? false
              )
            }
            disabled={subscription.status === "code sent"}
          >
            <FiPauseCircle />
            {subscription.isSuspended
              ? "Mark as Suspension Withdrawn"
              : "Mark as Suspend"}
          </button>
        ),
        viewDetails: (
          <button
            className="flex items-center gap-1 text-neutral-10 rounded cursor-pointer disabled:cursor-not-allowed"
           
            onClick={() =>{
              setIsPreviewOpen(true);
              setSelectedSubscription(subscription);
            }}
          >
            <FiEye /> View Details
          </button>
        ),
        createdAt: subscription.createdAt,
      };
    })
    // Sort by newest first
    .sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    });

  const allWaitlistedUsersData = allSubscriptions
    ?.filter(
      (subscription: TBoardRoomBanterSubscription) =>
        subscription.status === "waitlist"
    )
    ?.map((subscription: TBoardRoomBanterSubscription) => {
      return {
        _id: subscription._id,
        name: subscription.name,
        email: subscription.email,
        phoneNumber: subscription.phoneNumber,
        status: (
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold border capitalize ${
              statusColors[subscription.status]
            }`}
          >
            {subscription.status}
          </span>
        ),
        sendCouponCode: (
          <button
            className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs cursor-pointer"
            onClick={() => {
              setIsCouponCodeModalOpen(true);
              setSubscriptionId(subscription._id);
              setEmail(subscription.email);
            }}
          >
            <RiCoupon3Line />
            Send Coupon Code
          </button>
        ),
        createdAt: subscription.createdAt,
      };
    })
    // Sort by newest first
    .sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    });

  const subscriptionColumns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phoneNumber", label: "Phone Number" },
    { key: "date", label: "Date (Start - End)" },
    { key: "status", label: "Status" },
    { key: "whatsappGroup", label: "WhatsApp Group" },
    { key: "suspend", label: "Suspension" },
    { key: "viewDetails", label: "View Details" },
  ];

  const waitlistedUserColumns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phoneNumber", label: "Phone Number" },
    { key: "status", label: "Status" },
    { key: "sendCouponCode", label: "Send Coupon Code" },
  ];

  const [activeTab, setActiveTab] = useState<string>("All");

  const tabButtons = ["All", "Waitlisted Users"];

  const [sendCouponCode, { isLoading: isSendingCouponCode }] = useSendCouponCodeMutation();
  const handleSendCouponCode = async (data: TFormData) => {
    try {
      const payload = {
        subscriptionId,
        email,
        couponCode: data.couponCode,
      };
      const response = await sendCouponCode(payload).unwrap();
      if (response?.success) {
        toast.success(response?.message);
        setIsCouponCodeModalOpen(false);
        setActiveTab("All");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div>
      <DashboardContainer>
        <div className="font-Montserrat flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col lg:flex-row gap-5 lg:gap-0 justify-between items-start">
            <div>
              <h1 className="text-xl font-bold text-neutral-40">
                All Subscriptions
              </h1>
              <p className="text-neutral-65">Manage all subscriptions</p>
            </div>
            <div className="flex justify-between items-center gap-4 flex-wrap">
              {/* Filters */}
              <div className="flex items-start md:items-center flex-wrap gap-3 md:gap-0">
                <SearchInput
                  value={searchValue}
                  onChange={setSearchValue}
                  placeholder="Search by name, email, phone number..."
                />
                {activeTab === "All" && (
                  <Dropdown
                    className="py-1 px-3 w-full md:w-fit"
                    value={status}
                    onChange={setStatus}
                    options={[
                      { value: "", label: "All Status" },
                      { value: "waitlist", label: "Waitlisted" },
                      { value: "code sent", label: "Code Sent" },
                      { value: "active", label: "Active" },
                      { value: "paused", label: "Paused" },
                      { value: "expired", label: "Expired" },
                      { value: "pending", label: "Pending" },
                    ]}
                  />
                )}
                <div
                  className={`flex items-center gap-2 ${
                    activeTab !== "All" ? "ml-2" : ""
                  }`}
                >
                  {tabButtons?.map((tab) => (
                    <Button
                      variant={activeTab === tab ? "primary" : "secondary"}
                      onClick={() => setActiveTab(tab)}
                      label={tab}
                      classNames="py-2 px-3"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          {activeTab === "All" ? (
            <Table
              columns={subscriptionColumns}
              data={allSubscriptionsData}
              rowKey="_id"
              isLoading={isLoading || isFetching}
              page={page}
              totalPages={data?.data?.pagination?.totalPages}
              onPageChange={setPage}
            />
          ) : (
            <Table
              columns={waitlistedUserColumns}
              data={allWaitlistedUsersData}
              rowKey="_id"
              isLoading={isLoading || isFetching}
              page={page}
              totalPages={data?.data?.pagination?.totalPages}
              onPageChange={setPage}
            />
          )}
        </div>
      </DashboardContainer>

      <ConfirmationModal
        heading="Send Coupon Code"
        isConfirmationModalOpen={isSendCouponCodeModalOpen}
        setIsConfirmationModalOpen={setIsCouponCodeModalOpen}
        isCrossVisible={true}
      >
        <div className="flex flex-col items-center pb-6 px-8">
          <form
            onSubmit={handleSubmit(handleSendCouponCode)}
            className="w-full mt-4 flex flex-col items-end"
          >
            <TextInput
              label="Coupon Code"
              placeholder="Enter the coupon code"
              error={errors.couponCode}
              {...register("couponCode", {
                required: "Coupon Code is required",
              })}
            />
            <Button
              type="submit"
              label="Send"
              variant="primary"
              classNames="w-fit mt-4 px-3 py-2"
              isLoading={isSendingCouponCode}
            />
          </form>

          <div className="w-full px-6"></div>
        </div>
      </ConfirmationModal>

      <SubscriptionPreviewModal
        subscription={selectedSubscription}
        isOpen={isPreviewOpen}
        setIsOpen={setIsPreviewOpen}
      />
    </div>
  );
};

export default ManageSubscriptions;
