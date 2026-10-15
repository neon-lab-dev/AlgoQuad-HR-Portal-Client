/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TBoardRoomBanterSubscription } from "../../../../types/boardroomBanter.types";
import ConfirmationModal from "../../../ConfirmationModal/ConfirmationModal";

type Props = {
  subscription: TBoardRoomBanterSubscription | null;
  isOpen: boolean;
  setIsOpen: any;
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

export default function SubscriptionPreviewModal({
  subscription,
  isOpen,
  setIsOpen,
}: Props) {
  if (!subscription) return null;

  const {
    name,
    email,
    phoneNumber,
    qualification,
    profession,
    message,
    startDate,
    endDate,
    status,
    pauseDate,
    resumeDate,
    cancelDate,
    razorpaySubscriptionId,
    razorpayPaymentId,
    razorpaySignature,
    isAddedToWhatsappGroup,
    isSuspended,
    isRemoved,
    pauseReason,
    cancelReason,
    dateRange,
  } = subscription;

  const statusStyle =
    statusColors[status] || "text-gray-600 bg-gray-100 border-gray-400";

  return (
    <ConfirmationModal
      heading="Subscription Preview"
      isConfirmationModalOpen={isOpen}
      setIsConfirmationModalOpen={setIsOpen}
      isCrossVisible={true}
    >
      <div className="flex flex-col items-center pb-6 px-6 max-h-[70vh] overflow-y-auto mt-5">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          {/* Left side */}
          <div className="space-y-2">
            <p>
              <span className="font-semibold">Name:</span> {name}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {email}
            </p>
            <p>
              <span className="font-semibold">Phone:</span> {phoneNumber}
            </p>
            {qualification && (
              <p>
                <span className="font-semibold">Qualification:</span>{" "}
                {qualification}
              </p>
            )}
            {profession && (
              <p>
                <span className="font-semibold">Profession:</span> {profession}
              </p>
            )}
            {message && (
              <p>
                <span className="font-semibold">Message:</span> {message}
              </p>
            )}
            {/* Status Badge */}
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium border ${statusStyle} mt-4 w-fit`}
            >
              {status.toUpperCase()}
            </div>
          </div>

          {/* Right side */}
          <div className="space-y-2">
            <p>
              <span className="font-semibold">Start Date:</span>{" "}
              {new Date(startDate).toLocaleDateString()}
            </p>
            <p>
              <span className="font-semibold">End Date:</span>{" "}
              {new Date(endDate).toLocaleDateString()}
            </p>
            {dateRange && (
              <p>
                <span className="font-semibold">Pause Date Range:</span>{" "}
                {dateRange}
              </p>
            )}
            {pauseDate && (
              <p>
                <span className="font-semibold">Paused At:</span>{" "}
                {new Date(pauseDate).toLocaleDateString()}
              </p>
            )}
            {resumeDate && (
              <p>
                <span className="font-semibold">Resumed At:</span>{" "}
                {new Date(resumeDate).toLocaleDateString()}
              </p>
            )}
            {cancelDate && (
              <p>
                <span className="font-semibold">Cancelled At:</span>{" "}
                {new Date(cancelDate).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        {/* Extra details */}
        <div className="w-full mt-4 space-y-2 text-sm">
          {pauseReason && (
            <p>
              <span className="font-semibold">Pause Reason:</span> {pauseReason}
            </p>
          )}
          {cancelReason && (
            <p>
              <span className="font-semibold">Cancel Reason:</span>{" "}
              {cancelReason}
            </p>
          )}
          {razorpaySubscriptionId && (
            <p>
              <span className="font-semibold">Razorpay Sub ID:</span>{" "}
              {razorpaySubscriptionId}
            </p>
          )}
          {razorpayPaymentId && (
            <p>
              <span className="font-semibold">Payment ID:</span>{" "}
              {razorpayPaymentId}
            </p>
          )}
          {razorpaySignature && (
            <p>
              <span className="font-semibold">Signature:</span>{" "}
              {razorpaySignature}
            </p>
          )}

          <div className="flex flex-wrap gap-2 mt-3">
            <span
              className={`px-2 py-1 text-xs rounded border ${
                isAddedToWhatsappGroup
                  ? "bg-green-100 text-green-600 border-green-400"
                  : "bg-gray-100 text-gray-500 border-gray-300"
              }`}
            >
              Added to WhatsApp Group
            </span>
            {isSuspended && (
              <span
                className={`px-2 py-1 text-xs rounded border ${
                  isSuspended
                    ? "bg-red-100 text-red-600 border-red-400"
                    : "bg-gray-100 text-gray-500 border-gray-300"
                }`}
              >
                Suspended
              </span>
            )}
            {isRemoved && (
              <span
                className={`px-2 py-1 text-xs rounded border ${
                  isRemoved
                    ? "bg-red-100 text-red-600 border-red-400"
                    : "bg-gray-100 text-gray-500 border-gray-300"
                }`}
              >
                Removed
              </span>
            )}
          </div>
        </div>
      </div>
    </ConfirmationModal>
  );
}
