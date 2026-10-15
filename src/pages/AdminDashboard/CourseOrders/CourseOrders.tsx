import { useState } from "react";
import { useGetAllCourseOrdersQuery } from "../../../redux/Features/CourseOrders/courseOrdersApi";
import type { TCourseOrder } from "../../../types/courseOrder.types";
import { formatDate } from "../../../utils/formatDate";
import DashboardContainer from "../../../components/Dashboard/SharedComponents/DashboardContainer/DashboardContainer";
import SearchInput from "../../../components/Reusable/SearchInput/SearchInput";
import Table from "../../../components/Reusable/Table/Table";
import Button from "../../../components/Reusable/Button/Button";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const CourseOrders = () => {
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { data, isLoading, isFetching } = useGetAllCourseOrdersQuery({
    keyword: searchQuery,
    page,
  });

  const allCourseOrders = data?.data?.courseOrders || [];

  // Table row
  const allCourseOrdersData = allCourseOrders?.map(
    (courseOrder: TCourseOrder) => {
      return {
        _id: courseOrder?._id,
        orderId: courseOrder?.orderId,
        title: courseOrder?.name,
        customerName: courseOrder?.name,
        email: courseOrder?.email,
        phoneNumber: courseOrder?.phoneNumber,
        totalAmount: `₹${courseOrder?.totalAmount}`,
        createdAt: formatDate(courseOrder?.createdAt),
      };
    }
  );

  const orderColumns = [
    { key: "orderId", label: "Order ID" },
    { key: "title", label: "Title" },
    { key: "customerName", label: "Customer Name" },
    { key: "email", label: "Email" },
    { key: "phoneNumber", label: "Phone Number" },
    { key: "totalAmount", label: "Total Amount" },
    { key: "createdAt", label: "Order Date" },
  ];

  // Export
  const handleExportOrders = () => {
    if (!allCourseOrders || allCourseOrders?.length === 0) return;

    const exportData = allCourseOrders?.map((order: TCourseOrder) => ({
      "Order ID": order._id,
      Title: order?.name,
      "Customer Name": order?.name,
      Email: order?.email,
      phoneNumber: order?.phoneNumber,
      "Total Amount": order.totalAmount,
      "Order Date": formatDate(order.createdAt),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "orders.xlsx");
  };

  return (
    <div>
      <div className="mt-6 font-Montserrat">
        <DashboardContainer>
          <div className="font-Montserrat flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row gap-5 lg:gap-0 justify-between items-start">
              <div>
                <h1 className="text-xl font-bold text-neutral-40">
                  Course Orders ({allCourseOrders?.length || 0})
                </h1>
                <p className="text-neutral-65">Manage customer course orders</p>
              </div>
              <div className="flex justify-between items-center gap-4 flex-wrap">
                {/* Filters */}
                <div className="flex items-center gap-2 flex-wrap">
                  <SearchInput
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search course orders..."
                  />
                </div>
              </div>
            </div>

            {/* Table */}
            <Table
              columns={orderColumns}
              data={allCourseOrdersData}
              //   actions={ac}
              rowKey="_id"
              isLoading={isLoading || isFetching}
              page={page}
              onPageChange={setPage}
              totalPages={data?.data?.pagination?.totalPages}
            />

            <Button
              variant="primary"
              onClick={handleExportOrders}
              label="Export"
              classNames="w-fit self-end py-2 px-4"
            />
          </div>
        </DashboardContainer>
      </div>
    </div>
  );
};

export default CourseOrders;
