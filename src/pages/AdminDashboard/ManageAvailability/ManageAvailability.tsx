/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import ConfirmationModal from "../../../components/ConfirmationModal/ConfirmationModal";
import DashboardContainer from "../../../components/Dashboard/SharedComponents/DashboardContainer/DashboardContainer";
import Button from "../../../components/Reusable/Button/Button";
import Table from "../../../components/Reusable/Table/Table";
import TextInput from "../../../components/Reusable/TextInput/TextInput";
import { useState } from "react";
import {
  useAddAvailabilityMutation,
  useDeleteAvailabilityMutation,
  useGetAllAvailabilityQuery,
} from "../../../redux/Features/Availability/availabilityApi";
import type { TAvailability } from "../../../types/availability.types";
import { FiDelete } from "react-icons/fi";
import { formatDate } from "../../../utils/formatDate";
import toast from "react-hot-toast";

type TFormData = {
  date: string;
};

const ManageAvailability = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TFormData>();
  const [isCategoryModalOpen, setIsCategoryModalOpen] =
    useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const { data, isLoading, isFetching } = useGetAllAvailabilityQuery({
    page,
  });
  const [deleteAvailability] = useDeleteAvailabilityMutation();
  const [addAvailability, { isLoading: isAddingAvailability }] =
    useAddAvailabilityMutation();

  const allCategoriesData = data?.data?.availabilities?.map(
    (availability: TAvailability) => {
      return {
        date: formatDate(availability.date),
        status: (
          <p
            className={
              availability?.isAvailable ? "text-green-600" : "text-red-600"
            }
          >
            {availability?.isAvailable ? "Available" : "Unavailable"}
          </p>
        ),
        bookingStatus: (
          <p
            className={
              availability?.isBooked ? "text-green-600" : "text-gray-500"
            }
          >
            {availability?.isBooked ? "Booked" : "Not Booked"}
          </p>
        ),
        action: (
          <button
            className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 rounded text-xs cursor-pointer disabled:cursor-not-allowed"
            onClick={() => handleDeleteAvailability(availability._id)}
          >
            <FiDelete />
            Remove
          </button>
        ),
      };
    }
  );

  const categoryColumns = [
    { key: "date", label: "Date" },
    { key: "status", label: "Availability Status" },
    { key: "bookingStatus", label: "Booking Status" },
    { key: "action", label: "Remove Availability" },
  ];

  const handleDeleteAvailability = async (id: string) => {
    toast.promise(deleteAvailability(id).unwrap(), {
      loading: "Deleting...",
      success: "Deleted successfully.",
      error: (err: any) => err?.data?.message || "Something went wrong!",
    });
  };

  const handleAddAvailability = async (data: TFormData) => {
    try {
      const payload = {
        date: data.date,
      };
      const response = await addAvailability(payload).unwrap();
      if (response?.success) {
        toast.success(response?.message);
        setIsCategoryModalOpen(false);
        reset();
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
                Availabilities
              </h1>
              <p className="text-neutral-65">Manage availabilities</p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant={"primary"}
                onClick={() => setIsCategoryModalOpen(true)}
                label={"Add Availability"}
                classNames="py-2 px-3"
              />
            </div>
          </div>

          {/* Table */}
          <Table
            columns={categoryColumns}
            data={allCategoriesData}
            rowKey="_id"
            isLoading={isLoading || isFetching}
            page={page}
            totalPages={data?.data?.pagination?.totalPages}
            onPageChange={setPage}
          />
        </div>
      </DashboardContainer>

      <ConfirmationModal
        heading="Add Available Date"
        isConfirmationModalOpen={isCategoryModalOpen}
        setIsConfirmationModalOpen={setIsCategoryModalOpen}
        isCrossVisible={true}
      >
        <div className="flex flex-col items-center pb-6 px-4 md:px-8">
          <form
            onSubmit={handleSubmit(handleAddAvailability)}
            className="w-full mt-4 flex flex-col items-end"
          >
            <TextInput
              label="Date"
              type="date"
              placeholder="Enter date"
              error={errors.date}
              {...register("date", {
                required: "Date is required",
              })}
            />
            <Button
              type="submit"
              label="Add Availability"
              variant="primary"
              classNames="w-fit mt-4 px-3 py-2"
              isLoading={isAddingAvailability}
            />
          </form>

          <div className="w-full px-6"></div>
        </div>
      </ConfirmationModal>
    </div>
  );
};

export default ManageAvailability;
