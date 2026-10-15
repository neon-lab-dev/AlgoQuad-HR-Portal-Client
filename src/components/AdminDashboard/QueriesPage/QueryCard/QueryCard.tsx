/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { FiTrash2, FiMaximize2, FiCopy } from "react-icons/fi";
import { formatDate } from "../../../../utils/formatDate";
import type { THelpDesk } from "../../../../types/helpdesk.types";
import toast from "react-hot-toast";
import {
  useDeleteQueryMutation,
  useUpdateQueryStatusMutation,
} from "../../../../redux/Features/HelpDesk/helpDeskApi";

type QueryCardProps = {
  query: THelpDesk;
  variant: "admin" | "user";
};

const QueryCard: React.FC<QueryCardProps> = ({ query, variant }) => {
  const [showScreenshot, setShowScreenshot] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const [updateQueryStatus, { isLoading: isUpdatingStatus }] =
    useUpdateQueryStatusMutation();
  const [deleteQuery] = useDeleteQueryMutation();

  const handleChangeStatus = async (status: string) => {
    try {
      const payload = {
        status,
      };

      const response = await updateQueryStatus({
        id: query._id,
        data: payload,
      }).unwrap();
      if (response?.success) {
        toast.success(response?.message);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  const handleDeleteQuery = async () => {
    const id = query._id;
    toast.promise(deleteQuery(id).unwrap(), {
      loading: "Deleting query...",
      success: "Query deleted successfully.",
      error: (err: any) => err?.data?.message || "Something went wrong!",
    });
  };

  const updateButtons = [
    {
      label: "Mark as Pending",
      key: "pending",
      action: () => handleChangeStatus("pending"),
      disabled: query.status === "pending",
    },
    {
      label: "Mark as Resolved",
      key: "resolved",
      action: () => handleChangeStatus("resolved"),
      disabled: query.status === "resolved",
    },
  ];

  return (
    <>
      {showScreenshot && query.imageUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
          {/* Close button */}
          <button
            onClick={() => setShowScreenshot(false)}
            className="absolute top-4 right-4 text-white bg-gray-800 bg-opacity-50 hover:bg-opacity-80 p-2 rounded-full transition size-10 cursor-pointer hover:bg-primary-10"
          >
            ✕
          </button>

          <img
            src={query.imageUrl}
            alt="screenshot"
            className="max-h-[90%] max-w-[90%] rounded-lg shadow-lg"
          />
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow relative">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-[6px]">
            <h3 className="text-lg font-semibold text-neutral-10">
              {query.userId.name}
            </h3>

            <div className="flex items-center gap-2 text-sm text-neutral-10">
              {query.userId.email}
              <button
                onClick={() => copyToClipboard(query.userId.email)}
                className="text-primary-10 hover:text-gray-600 cursor-pointer"
                title="Copy Email"
              >
                <FiCopy size={14} />
              </button>
            </div>

            <div className="flex items-center gap-2 text-sm text-neutral-10">
              {query.userId.phoneNumber}
              <button
                onClick={() => copyToClipboard(query.userId.phoneNumber)}
                className="text-primary-10 hover:text-gray-600 cursor-pointer"
                title="Copy Phone"
              >
                <FiCopy size={14} />
              </button>
            </div>

            <p className="text-xs text-neutral-10">
              User ID: {query.userCustomId}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleDeleteQuery}
              className="text-red-500 hover:text-red-700 p-1 rounded cursor-pointer"
              title="Delete"
            >
              <FiTrash2 size={20} />
            </button>
          </div>
        </div>

        <div className="bg-neutral-90/30 rounded-lg p-3">
          <p className="text-gray-700 mb-3 italic">{query.message}</p>
        </div>

        {query.imageUrl && (
          <div className="my-3">
            <button
              onClick={() => setShowScreenshot(true)}
              className="flex items-center gap-2 text-primary-600 hover:text-primary-800 font-medium text-sm cursor-pointer hover:text-primary-10 transition duration-300"
            >
              <FiMaximize2 /> View Screenshot
            </button>
          </div>
        )}

        <div className="flex flex-col xl:flex-row justify-between items-start md:items-center mt-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
              query.status === "resolved"
                ? "bg-green-100 text-green-800"
                : query.status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {query.status}
          </span>

          {variant === "admin" && (
            <div className="flex flex-col md:flex-row gap-2 w-full md:w-fit mt-3 md:mt-0">
              {updateButtons?.map((statusOption) => (
                <button
                  key={statusOption?.label}
                  onClick={statusOption?.action}
                  className={`px-3 py-1 rounded text-sm font-medium border transition cursor-pointer disabled:cursor-not-allowed w-full md:w-fit ${
                    query.status === statusOption?.key
                      ? "bg-gray-100 text-gray-700 cursor-not-allowed border-gray-100"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                  disabled={statusOption?.disabled || isUpdatingStatus}
                >
                  {statusOption?.label}
                </button>
              ))}

              {/* <a
                href={`mailto:${query.userId.email}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 rounded text-sm font-medium bg-primary-10 text-white hover:bg-primary-9 flex items-center gap-1"
              >
                <FiMail /> Send Email
              </a> */}
            </div>
          )}
        </div>

        <p className="text-xs text-neutral-10 mt-2">
          Raised At: {formatDate(query?.createdAt)}
        </p>
      </div>
    </>
  );
};

export default QueryCard;
