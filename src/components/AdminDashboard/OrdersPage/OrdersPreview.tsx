/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import Dropdown from "../../Reusable/Dropdown/Dropdown";
import {
  useGetSingleProductOrderByIdQuery,
  useUpdateOrderStatusMutation,
} from "../../../redux/Features/ProductOrders/productOrdersApi";
import { formatDate } from "../../../utils/formatDate";
import { FiCopy } from "react-icons/fi";
import toast from "react-hot-toast";
import Loader from "../../Shared/Loader/Loader";
type TOrdersPreviewProps = {
  orderId: string;
};

const OrdersPreview: React.FC<TOrdersPreviewProps> = ({ orderId }) => {
  const { data, isLoading, isFetching } =
    useGetSingleProductOrderByIdQuery(orderId);
  const singleProductOrder = data?.data || {};
  const [status, setStatus] = useState(singleProductOrder?.status);

  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  const handleUpdateOrderStatus = async (status: string) => {
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

  return (
    <div className="pb-5 px-10  shadow-md w-full  font-Montserrat">
      {isLoading || isFetching ? (
        <Loader />
      ) : (
        <>
          {/* Order Details */}
          <div className="mb-4 space-y-2">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              Order #{singleProductOrder?.orderId}
              <FiCopy
                className="cursor-pointer text-gray-500 hover:text-primary-10"
                onClick={() => {
                  if (singleProductOrder?.orderId) {
                    navigator.clipboard.writeText(singleProductOrder.orderId);
                    toast.success("Order ID copied!");
                  }
                }}
              />
            </h2>
            <p className="text-sm text-gray-600">
              Customer: {singleProductOrder?.userId?.name} (
              {singleProductOrder.userId?.email})
            </p>
            <p className="text-sm text-gray-600">
              Address Line 1: {singleProductOrder?.userId?.addressLine1 || "N/A"}
            </p>
            <p className="text-sm text-gray-600">
              Address Line 2: {singleProductOrder?.userId?.addressLine2 || "N/A"}
            </p>
            <p className="text-sm text-gray-600">
              City: {singleProductOrder?.userId?.city}, Pin Code:{singleProductOrder?.userId?.pinCode}
            </p>
            <p className="text-sm text-gray-500">
              Placed on: {formatDate(singleProductOrder?.createdAt)}
            </p>

            {/* Status Dropdown */}
            <div className="mt-2 flex items-center">
              <label className="mr-2 font-medium">Change Status:</label>
              <Dropdown
                className="py-1 px-3"
                value={status}
                onChange={(value: string) => {
                  setStatus(value);
                  handleUpdateOrderStatus(value.toLowerCase());
                }}
                options={[
                  { value: "pending", label: "Pending", disabled: true },
                  { value: "shipped", label: "Shipped" },
                  { value: "cancelled", label: "Cancelled" },
                ]}
              />
            </div>
          </div>

          {/* Products List */}
          <div>
            <h3 className="font-semibold mb-2">Products</h3>
            <div className="flex flex-col gap-3">
              {singleProductOrder?.orderedItems?.map((product: any) => (
                <div
                  key={product?.productId?._id}
                  className="flex items-center gap-4 border border-neutral-90 p-2 rounded"
                >
                  <img
                    src={product?.productId?.imageUrls[0]}
                    alt={product?.productId?.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1 capitalize">
                    <h4 className="font-medium">{product?.productId?.name} ({product?.color})</h4>
                    <div className="flex justify-between gap-[6px] items-center w-fit">
                      {" "}
                      <p className="text-sm text-gray-500">
                        {product?.productId?.category}
                      </p>
                      |<p className="text-sm">Size: {product?.size}</p>|
                      <p className="text-sm">Qty: {product?.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">
                      ₹{product?.price} x {product?.quantity}
                    </p>
                    <p className="text-success-15 font-semibold">
                      ₹{product?.price * product?.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Total */}

          <div className="mt-4 border-t border-neutral-90 flex items-center justify-end pt-3 text-right font-semibold">
            Total: ₹{singleProductOrder?.totalAmount}
          </div>
        </>
      )}
    </div>
  );
};

export default OrdersPreview;
