/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import ConfirmationModal from "../../../ConfirmationModal/ConfirmationModal";
import Button from "../../../Reusable/Button/Button";
import TextInput from "../../../Reusable/TextInput/TextInput";
import toast from "react-hot-toast";
import { useReScheduleMeetingMutation } from "../../../../redux/Features/ChatAndChill/chatAndChill";

type TFormData = {
  bookingId: string;
  bookingDate: string;
};

type TReScheduleMeetingModalProps = {
  bookingId: string;
  isReScheduleMeetingModalOpen: boolean;
  setIsReScheduleMeetingModalOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >;
};
const ReScheduleMeetingModal: React.FC<TReScheduleMeetingModalProps> = ({
  bookingId,
  isReScheduleMeetingModalOpen,
  setIsReScheduleMeetingModalOpen,
}) => {
  const [reScheduleMeeting, { isLoading: isSchedulingMeeting }] =
    useReScheduleMeetingMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TFormData>();
  const handleScheduleMeeting = async (data: TFormData) => {
    try {
      const payload = {
        bookingId,
        bookingDate: data?.bookingDate,
      };

      const response = await reScheduleMeeting(payload).unwrap();
      if (response?.success) {
        toast.success(response?.message);
        setIsReScheduleMeetingModalOpen(false);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };
  return (
    <ConfirmationModal
      heading="Re-Schedule Meeting"
      isConfirmationModalOpen={isReScheduleMeetingModalOpen}
      setIsConfirmationModalOpen={setIsReScheduleMeetingModalOpen}
      isCrossVisible={true}
    >
      <div className="flex flex-col items-center py-5  px-3 md:px-8">
        <form
          onSubmit={handleSubmit(handleScheduleMeeting)}
          className="w-full mt-4 flex flex-col gap-4 items-end"
        >
          <TextInput
            label="Provide Booking date"
            placeholder=""
            type="date"
            error={errors.bookingDate}
            {...register("bookingDate", {
              required: "Booking date is required",
            })}
          />
          <div className="flex items-center gap-2">
            <Button
              type="submit"
              label="Cancel"
              variant="tertiary"
              classNames="w-fit px-3 py-2"
              onClick={() => setIsReScheduleMeetingModalOpen(false)}
            />
            <Button
              type="submit"
              label="Re-Schedule Meeting"
              variant="primary"
              classNames="w-fit p-3"
              isLoading={isSchedulingMeeting}
            />
          </div>
        </form>

        <div className="w-full px-6"></div>
      </div>
    </ConfirmationModal>
  );
};

export default ReScheduleMeetingModal;
