/* eslint-disable @typescript-eslint/no-explicit-any */
import Modal from "../../../Reusable/Modal/Modal";
import SelectDropdown from "../../../Reusable/SelectDropdown/SelectDropdown";
import { useForm } from "react-hook-form";
import Button from "../../../Reusable/Button/Button";
import { useUpdateApplicationMutation } from "../../../../redux/Features/Application/applicationApi";
import toast from "react-hot-toast";

const STATUS_OPTIONS = [
  "New",
  "Screening",
  "Interview",
  "Selected",
  "Rejected",
  "Hired",
];

type TChangeApplicationStatusModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  selectedApplicationId?: string;
};

const ChangeApplicationStatusModal: React.FC<
  TChangeApplicationStatusModalProps
> = ({ isModalOpen, setIsModalOpen, selectedApplicationId }) => {
  const [updateApplication, {isLoading}] = useUpdateApplicationMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>();

  const handleChangeStatus = async (data: any) => {
    try {
      const payload = {
        status: data?.status,
      };
      const response = await updateApplication({
        id: selectedApplicationId,
        data: payload,
      }).unwrap();
      if (response?.success) {
        toast.success(response?.message);
        setIsModalOpen(false);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };
  return (
    <Modal
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      heading="Change Application Status"
      description="Are you sure you want to change this application status?"
    >
      <form onSubmit={handleSubmit(handleChangeStatus)}>
        <SelectDropdown
          label="Status"
          {...register(`status`, {
            required: "Status is required",
          })}
          error={errors?.category}
          options={STATUS_OPTIONS || []}
        />

        {/* Actions */}
        <div className="flex justify-end gap-4 mt-6">
          <Button
            variant="custom"
            label="Cancel"
            type="button"
            classNames="py-2 px-3"
            onClick={() => setIsModalOpen(false)}
          />
          <Button
            variant="primary"
            label="Change Status"
            type="submit"
            classNames="py-2 px-3"
            isLoading={isLoading}
          />
        </div>
      </form>
    </Modal>
  );
};

export default ChangeApplicationStatusModal;
