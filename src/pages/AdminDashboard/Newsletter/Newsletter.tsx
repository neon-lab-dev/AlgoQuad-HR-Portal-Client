/* eslint-disable @typescript-eslint/no-explicit-any */
import { FiList } from "react-icons/fi";
import StatusCard from "../../../components/Dashboard/SharedComponents/StatusCard/StatusCard";
import DashboardContainer from "../../../components/Dashboard/SharedComponents/DashboardContainer/DashboardContainer";
import SearchInput from "../../../components/Reusable/SearchInput/SearchInput";
import Button from "../../../components/Reusable/Button/Button";
import Table from "../../../components/Reusable/Table/Table";
import { useState } from "react";
import {
  useDeleteNewsletterMutation,
  useGetAllNewsletterQuery,
} from "../../../redux/Features/NewsLetter/newsLetterApi";
import { formatDate } from "../../../utils/formatDate";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FiTrash2, FiCopy } from "react-icons/fi";
import type { TNewsletter } from "../../../types/newsletter.types";

const Newsletter = () => {
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching } = useGetAllNewsletterQuery({
    keyword: searchValue,
    page,
  });
  const allNewsletters = data?.data?.newsletters || [];

  const [deleteNewsletter] = useDeleteNewsletterMutation();

  const handleDeleteNewsletter = async (id: string) => {
    toast.promise(deleteNewsletter(id).unwrap(), {
      loading: "Deleting newsletter...",
      success: "Newsletter deleted successfully.",
      error: (err: any) => err?.data?.message || "Something went wrong!",
    });
  };

  // Mapping for table
  const allSubscribersData =
    allNewsletters?.map((data: TNewsletter) => {
      return {
        _id: data?._id,
        name: data?.name,
        email: data?.email,
        joinedDate: formatDate(data?.createdAt),
      };
    }) || [];

  const subscriberColumns = [
    { key: "_id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "joinedDate", label: "Joined Date" },
  ];

  // Copy single email
  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    toast.success("Email copied to clipboard!");
  };

  // Bulk copy emails
  const handleBulkCopy = () => {
    const emails = allNewsletters?.map((s: TNewsletter) => s.email).join(", ");
    navigator.clipboard.writeText(emails);
    toast.success("All emails copied!");
  };

  // Export to Excel
  const handleExportSubscribers = () => {
    if (!allNewsletters || allNewsletters?.length === 0) return;

    const exportData = allNewsletters?.map((s: any) => {
      const row: Record<string, any> = {};
      subscriberColumns.forEach((col) => {
        row[col.label] = s[col.key] ?? "";
      });
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Subscribers");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "subscribers.xlsx");
  };

  // Actions
  const subscriberActions = [
    {
      icon: <FiCopy />,
      label: "Copy Email",
      onClick: (row: any) => handleCopyEmail(row?.email),
    },
    // {
    //   icon: <FiMail />,
    //   label: "Send Email",
    //   onClick: (row: any) => {
    //     if (row?.email) {
    //       window.open(
    //         `https://mail.google.com/mail/?view=cm&fs=1&to=${row.email}`,
    //         "_blank"
    //       );
    //     }
    //   },
    //   className: "text-blue-600",
    // },
    {
      icon: <FiTrash2 />,
      label: "Delete",
      onClick: (row: any) => handleDeleteNewsletter(row?._id),
      className: "text-red-600",
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Newsletters */}
        <StatusCard
          icon={<FiList size={28} />}
          value={allNewsletters?.length || 0}
          label="Total Newsletters"
          badgeText="All"
          badgeBg="bg-blue-100"
          badgeBorder="border-blue-400"
          badgeTextColor="text-blue-600"
        />
      </div>

      <div className="mt-6 font-Montserrat">
        <DashboardContainer>
          <div className="font-Montserrat flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row gap-5 lg:gap-0 justify-between items-start">
              <div>
                <h1 className="text-xl font-bold text-neutral-40">
                  Newsletter Subscribers
                </h1>
                <p className="text-neutral-65">
                  Manage and export your newsletter subscribers
                </p>
              </div>
              <div className="flex justify-between items-center gap-4 flex-wrap">
                {/* Filter */}
                <div className="flex items-center gap-3 md:gap-2 flex-wrap">
                  <SearchInput
                    value={searchValue}
                    onChange={setSearchValue}
                    placeholder="Search by name or email..."
                  />
                  <Button
                    variant="secondary"
                    onClick={handleBulkCopy}
                    label="Copy All Emails"
                    classNames="w-fit py-2 px-3"
                  />
                  <Button
                    variant="primary"
                    onClick={handleExportSubscribers}
                    label="Export"
                    classNames="w-fit py-2 px-4 border-2 border-primary-10"
                  />
                </div>
              </div>
            </div>

            {/* Table */}
            <Table
              columns={subscriberColumns}
              data={allSubscribersData}
              actions={subscriberActions}
              rowKey="_id"
              isLoading={isLoading || isFetching}
              page={page}
              onPageChange={setPage}
              totalPages={data?.data?.pagination?.totalPages}
            />
          </div>
        </DashboardContainer>
      </div>
    </div>
  );
};

export default Newsletter;
