/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { ICONS } from "../../../../assets";
import { formatDate } from "../../../../utils/formatDate";
import { CgCalendarDates } from "react-icons/cg";
import { pdf } from "@react-pdf/renderer";
import Invoice from "../../Invoice/Invoice";

interface MyOrdersCardProps {
  variant: "courseOrder" | "productOrder";
  order: any;
  course?: any;
}

const MyOrdersCard: React.FC<MyOrdersCardProps> = ({
  variant,
  order,
  course,
}) => {
  const courseInvoicedData = {
    invoiceId: order?.orderId,
    date: order?.createdAt,
    customerName: order?.userId?.name,
    customerAddress: `${order?.userId?.addressLine1}, ${order?.userId?.city}, ${order?.userId?.pinCode}`,
    orderedItems:
      order?.courses?.map((course: any) => ({
        name: course.courseTitle,
        quantity: 1,
        price: Number(course.coursePrice),
        total: Number(course.coursePrice * 1),
      })) || [],
  };

  const productInvoicedData = {
    invoiceId: order?.orderId,
    date: order?.createdAt,
    customerName: order?.userId?.name,
    customerAddress: `${order?.userId?.addressLine1}, ${order?.userId?.city}, ${order?.userId?.pinCode}`,
    orderedItems:
      order?.orderedItems?.map((item: any) => ({
        name: `${item.productId.name} (Size:${item.size}, Color:${item.color})`,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
      })) || [],
  };
  const handleDownload = async () => {
    const blob = await pdf(
      <Invoice
        data={
          variant === "productOrder" ? productInvoicedData : courseInvoicedData
        }
      />
    ).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "invoice.pdf";
    link.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between rounded-lg border-[1px] w-full border-neutral-98 bg-surface-30 p-4 font-Montserrat">
      <div className="gap-4 flex flex-col md:flex-row items-start md:items-center justify-center w-fit relative">
        <div className="bg-secondary-25 rounded-lg size-[72px] text-sm font-semibold">
          {variant === "productOrder" ? (
            <>
              <div className="h-[54px] flex items-center justify-center text-secondary-10 text-4xl font-medium">
                {" "}
                {order.orderedItems?.length || 0}
              </div>
              <div className="text-[11px] font-medium leading-[14px] text-center bg-neutral-120 w-full px-1 py-[2px] rounded-b-lg">
                Total Item{order?.orderedItems?.length > 1 ? "s" : ""}
              </div>
            </>
          ) : (
            <img
              src={course?.courseId?.imageUrl}
              alt=""
              className="size-[72px] rounded-lg object-cover"
            />
          )}
        </div>

        <div className="flex md:hidden items-center gap-4 absolute top-4 -right-28">
          <img
            onClick={handleDownload}
            src={ICONS.download}
            alt="download"
            className="size-6 cursor-pointer"
          />
        </div>

        <div className="text-neutral-20 w-fit 2xl:w-[452px]">
          <h2 className="font-medium leading-[22px] text-base truncate">
            {variant === "productOrder"
              ? "Fashion and Apparels"
              : course?.courseTitle}
          </h2>

          <p className="text-[13px] text-neutral-20">
            Order #{order.orderId} | ₹{order.totalAmount}
          </p>

          <p className="flex items-center gap-2 mt-2 text-neutral-85 text-[11px]">
            <CgCalendarDates />
            {formatDate(order?.createdAt)}
          </p>
        </div>
        <span
          className={`block text-xs px-2 py-1 rounded-md ml-0 md:ml-[200px] lg:ml-[300px] h-fit capitalize
    ${
      order.status === "shipped"
        ? "bg-green-50 text-green-600"
        : order.status === "pending"
        ? "bg-yellow-50 text-yellow-600"
        : order.status === "cancelled"
        ? "bg-red-50 text-red-600"
        : "bg-green-50 text-green-600"
    }`}
        >
          {order.status || "Paid"}
        </span>
      </div>

      {/* Right Section */}
      <div className="items-center justify-center hidden md:flex">
        <img
          onClick={handleDownload}
          src={ICONS.download}
          alt="download"
          className="size-6 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default MyOrdersCard;
