/* eslint-disable @typescript-eslint/no-explicit-any */
import ConfirmationModal from "../../ConfirmationModal/ConfirmationModal";
import TextInput from "../../Reusable/TextInput/TextInput";
import TextArea from "../../Reusable/TextArea/TextArea";
import Button from "../../Reusable/Button/Button";
import { useForm } from "react-hook-form";
import {
  useAddCourseBundleMutation,
  useUpdateCourseBundleMutation,
} from "../../../redux/Features/CourseBundle/courseBundleApi";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../../Shared/Loader/Loader";

type TFormData = {
  courseId: string[];
  name: string;
  price: string;
  description: string;
  file: any;
};

type TCreateOrEditBundleFormProps = {
  modalType: string;
  allCoursesData: any;
  isCourseBundleModalOpen: boolean;
  setIsCourseBundleModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setType: React.Dispatch<React.SetStateAction<string>>;
  defaultValues?: any;
  isLoading?: boolean;
};

const CreateOrEditBundleForm: React.FC<TCreateOrEditBundleFormProps> = ({
  modalType,
  allCoursesData,
  isCourseBundleModalOpen,
  setIsCourseBundleModalOpen,
  setType,
  defaultValues,
  isLoading,
}) => {
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [addCourseBundle, { isLoading: isAdding }] =
    useAddCourseBundleMutation();
  const [updateCourseBundle, { isLoading: isUpdating }] =
    useUpdateCourseBundleMutation();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TFormData>();

  useEffect(() => {
    if (defaultValues && modalType === "edit") {
      setValue("name", defaultValues.name);
      setValue("price", defaultValues.price);
      setValue("description", defaultValues.description);
      setSelectedCourseIds(defaultValues.courseId);
    }
  }, [defaultValues, setValue, modalType]);

  const handleCreateCourseBundle = async (data: TFormData) => {
    try {
      if (selectedCourseIds.length === 0) {
        toast.error("Please select at least two courses!");
        return;
      }
      const formData = new FormData();
      selectedCourseIds.forEach((id) => formData.append("courseId", id));
      formData.append("name", data.name);
      formData.append("price", data.price);
      formData.append("description", data.description || "");
      formData.append("file", data.file[0]);

      if (modalType === "edit") {
        const response = await updateCourseBundle({
          data: formData,
          id: defaultValues._id,
        }).unwrap();

        if (response?.success) {
          toast.success("Bundle updated successfully!");
          reset();
          setSelectedCourseIds([]);
          setType("Bundle Courses");
          setIsCourseBundleModalOpen(false);
        }
      }

      if (modalType === "add") {
        const response = await addCourseBundle(formData).unwrap();

        if (response?.success) {
          toast.success("Bundle created successfully!");
          reset();
          setSelectedCourseIds([]);
          setType("Bundle Courses");
          setIsCourseBundleModalOpen(false);
        }
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  return (
    <ConfirmationModal
      heading={modalType === "add" ? "Create a New Bundle" : "Edit Details"}
      isConfirmationModalOpen={isCourseBundleModalOpen}
      setIsConfirmationModalOpen={setIsCourseBundleModalOpen}
      isCrossVisible={true}
    >
      {isLoading ? (
        <div className="py-10">
          <Loader />
        </div>
      ) : (
        <div className="flex flex-col items-center pb-6 px-4 md:px-8 mt-3">
          <form
            onSubmit={handleSubmit(handleCreateCourseBundle)}
            className="w-full mt-4 flex flex-col gap-4"
          >
            <label className="flex flex-row items-center w-full justify-between text-neutral-65">
              <span className="text-neutral-10 leading-[18px] text-[15px] font-medium tracking-[-0.16] ">
                Select Course Ids
              </span>
            </label>
            <div className="flex flex-wrap gap-3">
              {allCoursesData?.map((course: any) => (
                <button
                  type="button"
                  onClick={() => {
                    if (selectedCourseIds?.includes(course._id)) {
                      setSelectedCourseIds(
                        selectedCourseIds.filter((id) => id !== course._id)
                      );
                    } else {
                      setSelectedCourseIds([
                        ...(selectedCourseIds || []),
                        course._id,
                      ]);
                    }
                  }}
                  className={`px-3 py-2 rounded-full font-medium w-fit text-sm cursor-pointer ${
                    selectedCourseIds?.includes(course._id)
                      ? "bg-primary-10 text-white"
                      : "bg-neutral-97 text-neutral-10"
                  }`}
                >
                  {course?.title}
                </button>
              ))}
            </div>

            <TextInput
              label="Bundle Name"
              type="text"
              placeholder="Enter bundle name"
              error={errors.name}
              {...register("name", { required: "Name is required" })}
            />

            <TextInput
              label="Price"
              type="number"
              placeholder="Enter price"
              error={errors.price}
              {...register("price", { required: "Price is required" })}
            />

            <TextArea
              label="Description"
              placeholder="Enter description"
              isRequired={false}
              {...register("description")}
            />

            <TextInput
              label="Image"
              type="file"
              error={errors.file}
              {...register("file")}
              isRequired={modalType === "edit" ? false : true}
            />

            {defaultValues?.imageUrl && (
              <img
                src={defaultValues?.imageUrl}
                alt={defaultValues?.name}
                className="size-20 rounded-lg"
              />
            )}

            <div className="flex justify-end">
              <Button
                type="submit"
                label="Submit"
                variant="primary"
                classNames="w-fit mt-4 px-3 py-2"
                isLoading={isAdding || isUpdating}
                disabled={isAdding || isUpdating}
              />
            </div>
          </form>
        </div>
      )}
    </ConfirmationModal>
  );
};

export default CreateOrEditBundleForm;
