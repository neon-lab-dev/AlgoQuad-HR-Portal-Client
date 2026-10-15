/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import OrderStatusCards from "../../../components/AdminDashboard/OrdersPage/OrdersStatusCard";
import {
  useGetAllProductOrdersQuery,
  useUpdateOrderStatusMutation,
} from "../../../redux/Features/ProductOrders/productOrdersApi";
import type { TProductOrder } from "../../../types/productOrder.types";
import { formatDate } from "../../../utils/formatDate";
import toast from "react-hot-toast";
import { FiEye, FiTruck, FiXCircle } from "react-icons/fi";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import DashboardContainer from "../../../components/Dashboard/SharedComponents/DashboardContainer/DashboardContainer";
import SearchInput from "../../../components/Reusable/SearchInput/SearchInput";
import Dropdown from "../../../components/Reusable/Dropdown/Dropdown";
import Table from "../../../components/Reusable/Table/Table";
import Button from "../../../components/Reusable/Button/Button";
import ConfirmationModal from "../../../components/ConfirmationModal/ConfirmationModal";
import OrdersPreview from "../../../components/AdminDashboard/OrdersPage/OrdersPreview";

const ProductOrders = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const { data, isLoading, isFetching } = useGetAllProductOrdersQuery({
    keyword: searchValue,
    status: statusFilter,
  });
  const [isOrderPreviewOpen, setIsOrderPreviewOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  const allProductOrders = data?.data?.productOrders || [];

  // Table row
  const allOrdersData = allProductOrders?.map((order: TProductOrder) => {
    const statusColors: Record<TProductOrder["status"], string> = {
      pending: "bg-yellow-100 text-yellow-800",
      shipped: "bg-purple-100 text-purple-800",
      cancelled: "bg-red-100 text-red-800",
    };

    return {
      _id: order?._id,
      orderId: order?.orderId,
      customerName: order?.userId?.name,
      email: order?.userId?.email,
      phoneNumber: order?.userId?.phoneNumber,
      totalAmount: `₹${order?.totalAmount}`,
      status: (
        <span
          className={`inline-block px-2 py-1 text-xs font-semibold rounded-full capitalize ${
            statusColors[order?.status]
          }`}
        >
          {order?.status}
        </span>
      ),
      createdAt: formatDate(order?.createdAt),
    };
  });

  const orderColumns = [
    { key: "orderId", label: "Order ID" },
    { key: "customerName", label: "Customer Name" },
    { key: "email", label: "Email" },
    { key: "phoneNumber", label: "Phone Number" },
    { key: "totalAmount", label: "Total Amount" },
    { key: "status", label: "Status" },
    { key: "createdAt", label: "Order Date" },
  ];

  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  const handleUpdateOrderStatus = async (status: string, orderId: string) => {
    try {
      const payload = {
        orderId,
        status,
      };

      await toast.promise(updateOrderStatus(payload).unwrap(), {
        loading: "Updating status...",
        success: (res: any) => res?.message || "Status updated successfully!",
        error: (err: any) => err?.data?.message || "Something went wrong!",
      });
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  const productOrderActions = [
    {
      icon: <FiEye />,
      label: "View",
      onClick: (row: any) => {
        setSelectedOrderId(row?.orderId);
        setIsOrderPreviewOpen(true);
      },
    },
    {
      icon: <FiTruck />,
      label: "Mark as Shipped",
      onClick: (row: any) => {
        handleUpdateOrderStatus("shipped", row?.orderId);
      },
      className: "text-blue-600",
    },
    {
      icon: <FiXCircle />,
      label: "Mark as Cancelled",
      onClick: (row: any) => {
        handleUpdateOrderStatus("cancelled", row?.orderId);
      },
      className: "text-orange-600",
    },
  ];

  // Export
  const handleExportOrders = () => {
    if (!allProductOrders || allProductOrders?.length === 0) return;

    const exportData = allProductOrders?.map((order: TProductOrder) => ({
      "Order ID": order._id,
      "Customer Name": order?.userId?.name,
      Email: order?.userId?.email,
      phoneNumber: order?.userId?.phoneNumber,
      "Total Amount": order.totalAmount,
      Status: order.status,
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
      <OrderStatusCards allProductOrders={allProductOrders} />

      <div className="mt-6 font-Montserrat">
        <DashboardContainer>
          <div className="font-Montserrat flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row gap-5 lg:gap-0 justify-between items-start">
              <div>
                <h1 className="text-xl font-bold text-neutral-40">Product Orders</h1>
                <p className="text-neutral-65">Manage customer product orders</p>
              </div>
              <div className="flex justify-between items-center gap-4 flex-wrap">
                {/* Filters */}
                <div className="flex items-center gap-2 flex-wrap">
                  <SearchInput
                    value={searchValue}
                    onChange={setSearchValue}
                    placeholder="Search orders..."
                  />
                  <Dropdown
                    className="py-1 px-3"
                    value={statusFilter}
                    onChange={setStatusFilter}
                    options={[
                      { value: "", label: "Select Status" },
                      { value: "pending", label: "Pending" },
                      { value: "shipped", label: "Shipped" },
                      { value: "cancelled", label: "Cancelled" },
                    ]}
                  />
                </div>
              </div>
            </div>

            {/* Table */}
            <Table
              columns={orderColumns}
              data={allOrdersData}
              actions={productOrderActions}
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

        {/* Order Preview Modal */}
        <ConfirmationModal
          isConfirmationModalOpen={isOrderPreviewOpen}
          setIsConfirmationModalOpen={setIsOrderPreviewOpen}
          isCrossVisible={true}
        >
          <OrdersPreview orderId={selectedOrderId} />
        </ConfirmationModal>
      </div>
    </div>
  );
};

export default ProductOrders;
