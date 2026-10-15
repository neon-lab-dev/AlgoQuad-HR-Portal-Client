/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import ConfirmationModal from "../../../ConfirmationModal/ConfirmationModal";
import Button from "../../../Reusable/Button/Button";
import TextInput from "../../../Reusable/TextInput/TextInput";
import toast from "react-hot-toast";
import { useScheduleMeetingMutation } from "../../../../redux/Features/ChatAndChill/chatAndChill";

type TFormData = {
  bookingId: string;
  meetingLink: string;
};

type TScheduleMeetingModalProps = {
  bookingId: string;
  isScheduleMeetingModalOpen: boolean;
  setIsScheduleMeetingModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
const ScheduleMeetingModal: React.FC<TScheduleMeetingModalProps> = ({
  bookingId,
  isScheduleMeetingModalOpen,
  setIsScheduleMeetingModalOpen,
}) => {
  const [scheduleMeeting, { isLoading: isSchedulingMeeting }] =
    useScheduleMeetingMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TFormData>();
  const handleScheduleMeeting = async (data: TFormData) => {
    try {
      const payload = {
        bookingId,
        meetingLink: data?.meetingLink,
      };

      const response = await scheduleMeeting(payload).unwrap();
      if (response?.success) {
        toast.success(response?.message);
        setIsScheduleMeetingModalOpen(false);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };
  return (
    <ConfirmationModal
      heading="Schedule Meeting"
      isConfirmationModalOpen={isScheduleMeetingModalOpen}
      setIsConfirmationModalOpen={setIsScheduleMeetingModalOpen}
      isCrossVisible={true}
    >
      <div className="flex flex-col items-center py-5 px-3 md:px-8">
        <form
          onSubmit={handleSubmit(handleScheduleMeeting)}
          className="w-full mt-4 flex flex-col gap-4 items-end"
        >
          <TextInput
            label="Add Meeting Link"
            placeholder="Ex : https://meet.google.com"
            error={errors.meetingLink}
            {...register("meetingLink", {
              required: "Meeting link is required",
            })}
          />
          <div className="flex items-center gap-2">
            <Button
              type="submit"
              label="Cancel"
              variant="tertiary"
              classNames="w-fit px-3 py-2"
              onClick={() => setIsScheduleMeetingModalOpen(false)}
            />
            <Button
              type="submit"
              label="Schedule Meeting"
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

export default ScheduleMeetingModal;
