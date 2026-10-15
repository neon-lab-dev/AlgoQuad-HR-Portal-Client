/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import ConfirmationModal from "../../../ConfirmationModal/ConfirmationModal";
import Button from "../../../Reusable/Button/Button";
import TextInput from "../../../Reusable/TextInput/TextInput";
import toast from "react-hot-toast";
import Textarea from "../../../Reusable/TextArea/TextArea";
import { useRaiseQueryMutation } from "../../../../redux/Features/HelpDesk/helpDeskApi";

type TFormData = {
  message: string;
  file?: string;
};

type TRaiseQueryModalProps = {
  isRaiseQueryModalOpen: boolean;
  setIsRaiseQueryModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
const RaiseQueryModal: React.FC<TRaiseQueryModalProps> = ({
  isRaiseQueryModalOpen,
  setIsRaiseQueryModalOpen,
}) => {
  const [raiseQuery, { isLoading: isSchedulingMeeting }] =
    useRaiseQueryMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TFormData>();

  const handleRaiseQuery = async (data: TFormData) => {
    try {
      const formData = new FormData();
      if (data.file?.[0]) formData.append("file", data.file[0]);

      formData.append("message", data.message);

      const response = await raiseQuery(formData).unwrap();
      if (response?.success) {
        toast.success(response?.message);
        setIsRaiseQueryModalOpen(false);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };
  return (
    <ConfirmationModal
      heading="Raise a Query"
      isConfirmationModalOpen={isRaiseQueryModalOpen}
      setIsConfirmationModalOpen={setIsRaiseQueryModalOpen}
      isCrossVisible={true}
    >
      <div className="flex flex-col items-center py-5 px-4 md:px-8">
        <form
          onSubmit={handleSubmit(handleRaiseQuery)}
          className="w-full mt-2 md:mt-4 flex flex-col gap-4"
        >
          <Textarea
            label="Please describe your issue"
            placeholder="E.g. I am facing an issue with..."
            error={errors.message}
            {...register("message", {
              required: "Message is required",
            })}
          />
          <TextInput
            label="Upload Screenshot"
            type="file"
            error={errors.file}
            {...register("file")}
            isRequired={false}
          />
          <div className="flex items-center justify-end gap-2 mt-3">
            <Button
              type="submit"
              label="Cancel"
              variant="tertiary"
              classNames="w-fit px-3 py-2"
              onClick={() => setIsRaiseQueryModalOpen(false)}
            />
            <Button
              type="submit"
              label="Submit"
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

export default RaiseQueryModal;
