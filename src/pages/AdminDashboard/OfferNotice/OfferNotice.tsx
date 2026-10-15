/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Button from "../../../components/Reusable/Button/Button";
import ConfirmationModal from "../../../components/ConfirmationModal/ConfirmationModal";
import Textarea from "../../../components/Reusable/TextArea/TextArea";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  useAddOfferNoticeMutation,
  useDeleteOfferNoticeMutation,
  useGetAllOfferNoticesQuery,
  useGetSingleOfferNoticeByIdQuery,
  useUpdateOfferNoticeMutation,
} from "../../../redux/Features/OfferNotice/offerNoticeApi";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import type { TOfferNotice } from "../../../types/offerNotice.types";
import Loader from "../../../components/Shared/Loader/Loader";

type TFormData = {
  offerNotice: string;
};

const OfferNotice = () => {
  const [isOfferModalOpen, setIsOfferModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<"add" | "edit">("add");
  const [selectedNoticeId, setSelectedNoticeId] = useState<string | null>("");
  const { data: allOfferNotices, isLoading: isAllOfferNoticesLoading } =
    useGetAllOfferNoticesQuery({});
  const {
    data: singleOfferNotice,
    isLoading: isSingleOfferNoticeLoading,
    isFetching: isSingleOfferNoticeFetching,
  } = useGetSingleOfferNoticeByIdQuery(selectedNoticeId);
  const [addOfferNotice, { isLoading: isAddingOfferNotice }] =
    useAddOfferNoticeMutation();
  const [updateOfferNotice, { isLoading: isUpdatingOfferNotice }] =
    useUpdateOfferNoticeMutation();
  const [deleteOfferNotice] = useDeleteOfferNoticeMutation();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TFormData>();

  useEffect(() => {
    if (singleOfferNotice?.data && modalType === "edit") {
      setValue("offerNotice", singleOfferNotice?.data?.offerNotice);
    } else {
      setValue("offerNotice", "");
    }
  }, [setValue, singleOfferNotice?.data, modalType]);

  const handleSubmitNotice = async (data: TFormData) => {
    try {
      const payload = {
        offerNotice: data.offerNotice,
      };
      if (modalType === "add") {
        const response = await addOfferNotice(payload).unwrap();
        if (response?.success) {
          toast.success(response?.message);
          setIsOfferModalOpen(false);
          reset();
        }
      }
      if (modalType === "edit") {
        const response = await updateOfferNotice({
          id: selectedNoticeId,
          data: payload,
        }).unwrap();
        if (response?.success) {
          toast.success(response?.message);
          setIsOfferModalOpen(false);
          reset();
        }
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  const handleDeleteOfferNotice = async (id: string) => {
    toast.promise(deleteOfferNotice(id).unwrap(), {
      loading: "Deleting offer notice...",
      success: "Offer notice deleted successfully.",
      error: (err: any) => err?.data?.message || "Something went wrong!",
    });
  };
  return (
    <div className="font-Montserrat">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row gap-5 lg:gap-0 justify-between items-start">
          <div>
            <h1 className="text-xl font-bold text-neutral-40">Offer Notice</h1>
            <p className="text-neutral-65">Manage offer notice</p>
          </div>

          <Button
            variant={"primary"}
            onClick={() => {
              setModalType("add");
              setIsOfferModalOpen(true);
            }}
            label={"Add Notice"}
            classNames="py-2 px-3"
          />
        </div>

        {isAllOfferNoticesLoading ? (
          <div className="flex items-center justify-center mt-5">
            <Loader />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {allOfferNotices?.data?.offerNotices?.map(
              (notice: TOfferNotice) => (
                <div
                  key={notice?._id}
                  className="bg-white rounded-lg p-4 text-neutral-10 flex items-center justify-between"
                >
                  <p className="text-lg capitalize font-medium">
                    {notice?.offerNotice}
                  </p>

                  <div className="flex items-center gap-3 text-gray-600">
                    <button
                      onClick={() => {
                        setSelectedNoticeId(notice?._id);
                        setModalType("edit");
                        setIsOfferModalOpen(true);
                      }}
                      className="hover:text-blue-600 transition-colors cursor-pointer"
                    >
                      <FiEdit2 className="text-lg" />
                    </button>

                    <button
                      onClick={() => handleDeleteOfferNotice(notice?._id)}
                      className="hover:text-red-600 transition-colors cursor-pointer"
                    >
                      <FiTrash2 className="text-lg" />
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>

      <ConfirmationModal
        heading={`${modalType === "add" ? "Add" : "Edit"} Offer Notice`}
        isConfirmationModalOpen={isOfferModalOpen}
        setIsConfirmationModalOpen={setIsOfferModalOpen}
        isCrossVisible={true}
      >
        <div className="flex flex-col items-center pb-6 px-8">
          {isSingleOfferNoticeLoading || isSingleOfferNoticeFetching ? (
            <div className="mt-4">
              <Loader />
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(handleSubmitNotice)}
              className="w-full mt-4 flex flex-col"
            >
              <Textarea
                label="Offer Notice"
                placeholder="Enter offer notice"
                error={errors.offerNotice}
                {...register("offerNotice", {
                  required: "Offer Notice is required",
                })}
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  label="Submit"
                  variant="primary"
                  classNames="w-fit mt-4 px-3 py-2"
                  isLoading={isAddingOfferNotice || isUpdatingOfferNotice}
                />
              </div>
            </form>
          )}

          <div className="w-full px-6"></div>
        </div>
      </ConfirmationModal>
    </div>
  );
};

export default OfferNotice;
