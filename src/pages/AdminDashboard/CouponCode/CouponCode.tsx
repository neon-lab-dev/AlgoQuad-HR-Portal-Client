/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  useAddCouponCodeMutation,
  useDeleteCouponCodeMutation,
  useGetAllCouponCodesQuery,
} from "../../../redux/Features/CouponCode/couponCodeApi";
import type { TCouponCode } from "../../../types/couponCode.types";
import DashboardContainer from "../../../components/Dashboard/SharedComponents/DashboardContainer/DashboardContainer";
import SearchInput from "../../../components/Reusable/SearchInput/SearchInput";
import Table from "../../../components/Reusable/Table/Table";
import toast from "react-hot-toast";
import { FiCopy, FiTrash2 } from "react-icons/fi";
import Button from "../../../components/Reusable/Button/Button";
import ConfirmationModal from "../../../components/ConfirmationModal/ConfirmationModal";
import { useForm } from "react-hook-form";
import TextInput from "../../../components/Reusable/TextInput/TextInput";

type TFormData = {
  code: string;
};

const couponCodeColumns = [{ key: "couponCode", label: "Coupon Code" }];

const CouponCode = () => {
  const [page, setPage] = useState<number>(1);
  const [searchValue, setSearchValue] = useState<string>("");
  const { data, isLoading, isFetching } = useGetAllCouponCodesQuery({
    keyword: searchValue,
    page: page,
  });
  const allCouponCodes = data?.data?.couponCodes as TCouponCode[];
  const [deleteCouponCode] = useDeleteCouponCodeMutation();
  const [addCouponCode, { isLoading: isCouponCodeAdding }] =
    useAddCouponCodeMutation();

  const handleDeleteCouponCode = async (id: string) => {
    try {
      await toast.promise(deleteCouponCode(id).unwrap(), {
        loading: "Deleting...",
        success: (res: any) => res?.message || "Deleted successfully!",
        error: (err: any) => err?.data?.message || "Something went wrong!",
      });
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  const allCouponCodedata = allCouponCodes?.map((couponCode: TCouponCode) => {
    return {
      _id: couponCode._id,
      couponCode: (
        <div className="flex items-center justify-between">
          <span>{couponCode.code}</span>

          <div className="flex items-center gap-2">
            {/* Copy Button */}
            <button
              onClick={() => {
                navigator.clipboard.writeText(couponCode.code);
                toast.success("Coupon code copied!");
              }}
              className="p-1 rounded hover:bg-gray-100 cursor-pointer"
            >
              <FiCopy className="text-gray-600" />
            </button>

            {/* Delete Button */}
            <button
              onClick={() => handleDeleteCouponCode(couponCode._id)}
              className="p-1 rounded hover:bg-red-100 cursor-pointer"
            >
              <FiTrash2 className="text-red-500" />
            </button>
          </div>
        </div>
      ),
    };
  });

  const [isCouponCodeModalOpen, setIsCouponCodeModalOpen] =
    useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TFormData>();

  const handleAddCouponCode = async (data: TFormData) => {
    try {
      const payload = {
        couponCode: data.code,
      };
      const response = await addCouponCode(payload).unwrap();
      if (response?.success) {
        toast.success(response?.message);
        setIsCouponCodeModalOpen(false);
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
                All Coupon Codes
              </h1>
              <p className="text-neutral-65">Manage all coupon codes</p>
            </div>
            <div className="flex justify-between items-center gap-4 flex-wrap">
              {/* Filters */}
              <div className="flex items-center flex-wrap">
                <SearchInput
                  value={searchValue}
                  onChange={setSearchValue}
                  placeholder="Search coupon code..."
                />
              </div>
              <Button
                variant="primary"
                label="Add Coupon Code"
                classNames="py-2 px-3"
                onClick={() => setIsCouponCodeModalOpen(true)}
              />
            </div>
          </div>

          {/* Table */}
          <Table
            columns={couponCodeColumns}
            data={allCouponCodedata}
            rowKey="_id"
            isLoading={isLoading || isFetching}
            page={page}
            totalPages={data?.data?.pagination?.totalPages}
            onPageChange={setPage}
          />
        </div>
      </DashboardContainer>

      <ConfirmationModal
        heading=" Add New Category"
        isConfirmationModalOpen={isCouponCodeModalOpen}
        setIsConfirmationModalOpen={setIsCouponCodeModalOpen}
        isCrossVisible={true}
      >
        <div className="flex flex-col items-center pb-6 px-4 md:px-8">
          <form
            onSubmit={handleSubmit(handleAddCouponCode)}
            className="w-full mt-4 flex flex-col items-end"
          >
            <TextInput
              label="Coupon Code"
              placeholder="Enter coupon code"
              error={errors.code}
              {...register("code", {
                required: "Coupon code is required",
              })}
            />
            <Button
              type="submit"
              label="Add Category"
              variant="primary"
              classNames="w-fit mt-4 px-3 py-2"
              isLoading={isCouponCodeAdding}
            />
          </form>

          <div className="w-full px-6"></div>
        </div>
      </ConfirmationModal>
    </div>
  );
};

export default CouponCode;
