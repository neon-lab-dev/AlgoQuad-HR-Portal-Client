/* eslint-disable @typescript-eslint/no-explicit-any */
import Modal from "../../../Reusable/Modal/Modal";
import SelectDropdown from "../../../Reusable/SelectDropdown/SelectDropdown";
import { useForm } from "react-hook-form";
import Button from "../../../Reusable/Button/Button";

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
};

const ChangeApplicationStatusModal: React.FC<
  TChangeApplicationStatusModalProps
> = ({ isModalOpen, setIsModalOpen }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>();

  const handleChangeStatus = async (data: any) => {
    console.log(data);
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
          label="Category"
          {...register(`category`, {
            required: "Category is required",
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
            // isLoading={isAddingCourse || isUpdatingCourse}
          />
        </div>
      </form>
    </Modal>
  );
};

export default ChangeApplicationStatusModal;
