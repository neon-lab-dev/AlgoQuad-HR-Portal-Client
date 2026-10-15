import { useForm, useFieldArray } from "react-hook-form";
import TextInput from "../../../components/Reusable/TextInput/TextInput";
import Button from "../../../components/Reusable/Button/Button";
import SubscriptionStatus from "../../../components/Dashboard/SubscriptionStatus/SubscriptionStatus";
import { FiTrash2 } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useAddCourseMutation,
  useGetSingleCourseByIdQuery,
  useUpdateCourseMutation,
} from "../../../redux/Features/Course/courseApi";
import SelectDropdown from "../../../components/Reusable/SelectDropdown/SelectDropdown";
import toast from "react-hot-toast";
import Loader from "../../../components/Shared/Loader/Loader";
import Textarea from "../../../components/Reusable/TextArea/TextArea";

export type TFormDate = {
  title: string;
  subtitle: string;
  tagline: string;
  overview: string;
  benefits: { value: string }[];
  courseCoverage?: {
    title: string;
    description?: string;
  }[];
  accessType: "lifetime" | "subscription";
  category: string;
  duration: string;
  basePrice: number;
  discountedPrice: number;
  file?: FileList;
};

const ManageCourseForm = () => {
  const location = useLocation();
  const { id, action } = location.state;
  const { data: singleData, isLoading: isSingleDataLoading } =
    useGetSingleCourseByIdQuery(id);
  const [addCourse, { isLoading: isAddingCourse }] = useAddCourseMutation();
  const [updateCourse, { isLoading: isUpdatingCourse }] =
    useUpdateCourseMutation();
  const navigate = useNavigate();

  const [previewImage, setPreviewImage] = useState<string>("");

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TFormDate>({
    defaultValues: {
      benefits: [{ value: "" }],
      courseCoverage: [
        {
          title: "",
          description: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "benefits",
  });

  const {
    fields: courseCoverageFields,
    append: appendCoverageField,
    remove: removeCoverageField,
  } = useFieldArray({
    control,
    name: "courseCoverage",
  });

  const watchFile = watch("file");

  useEffect(() => {
    if (singleData?.data && action === "update") {
      const course = singleData.data;

      setValue("title", course.title);
      setValue("subtitle", course.subtitle);
      setValue("tagline", course.tagline);
      setValue("duration", course.duration);
      setValue("overview", course.overview);
      setValue("accessType", course.accessType);
      setValue("category", course.category);
      setValue("basePrice", course.basePrice);
      setValue("discountedPrice", course.discountedPrice);

      setValue(
        "benefits",
        course.benefits?.length
          ? course.benefits.map((b: string) => ({ value: b }))
          : [{ value: "" }]
      );

      setValue(
        "courseCoverage",
        course.courseCoverage?.length
          ? course.courseCoverage
          : [{ title: "", description: "" }]
      );

      if (course.imageUrl) {
        setPreviewImage(course.imageUrl);
      }
    }
  }, [action, singleData, setValue]);

  // Preview image if file input changes
  useEffect(() => {
    if (watchFile && watchFile[0]) {
      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(watchFile[0]);
    }
  }, [watchFile]);

  const handleSubmitCourse = async (data: TFormDate) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("subtitle", data.subtitle);
    formData.append("tagline", data.tagline);
    formData.append("duration", data.duration);
    formData.append("overview", data.overview);
    data.benefits.forEach((b) => formData.append("benefits[]", b.value));
    data?.courseCoverage?.forEach((item, index) => {
      formData.append(`courseCoverage[${index}][title]`, item.title);
      formData.append(
        `courseCoverage[${index}][description]`,
        item?.description ?? ""
      );
    });
    formData.append("accessType", data.accessType);
    formData.append("category", data.category);
    formData.append("basePrice", String(data.basePrice));
    formData.append("discountedPrice", String(data.discountedPrice));
    if (data.file?.[0]) formData.append("file", data.file[0]);

    try {
      if (action === "update" && id) {
        const response = await updateCourse({ data: formData, id }).unwrap();
        if (response?.success) {
          toast.success(response?.message || "Course updated successfully!");
          navigate(`/dashboard/admin/courses`);
        }
      } else {
        const response = await addCourse(formData).unwrap();
        console.log(response);

        if (response?.success) {
          toast.success(response?.message || "Course added successfully!");
          navigate(
            `/dashboard/admin/course/manage-lectures/${response?.data?._id}`
          );
        }
      }
    } catch (error) {
      console.error("Error saving course:", error);
    }
  };

  return (
    <div className="font-Montserrat min-h-screen">
      {isSingleDataLoading ? (
        <Loader />
      ) : (
        <SubscriptionStatus>
          <form
            onSubmit={handleSubmit(handleSubmitCourse)}
            className="flex flex-col gap-4 mt-6 w-full"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title */}
              <TextInput
                label="Course Title"
                placeholder="Enter course title"
                error={errors.title}
                {...register("title", { required: "Title is required" })}
              />

              {/* Subtitle */}
              <TextInput
                label="Subtitle"
                placeholder="Enter course subtitle"
                error={errors.subtitle}
                {...register("subtitle", { required: "Subtitle is required" })}
              />

              {/* Tagline */}
              <TextInput
                label="Tagline"
                placeholder="Catchy one-liner"
                error={errors.tagline}
                {...register("tagline", { required: "Tagline is required" })}
              />

              {/* Category */}
              <TextInput
                label="Category"
                placeholder="E.g., Web Development"
                error={errors.category}
                {...register("category", { required: "Category is required" })}
              />
            </div>

            <Textarea
              label="Course Overview"
              placeholder="Enter course overview"
              {...register("overview", {
                required: "Course overview is required",
              })}
            />
            {/* Benefits */}
            <div className="space-y-3">
              <h3 className="font-semibold">Benefits</h3>
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <TextInput
                    placeholder="Benefit"
                    error={errors.benefits?.[index]?.value}
                    {...register(`benefits.${index}.value` as const, {
                      required: "Benefit is required",
                    })}
                  />
                  {fields.length > 1 && (
                    <FiTrash2
                      className="cursor-pointer size-5 text-primary-10"
                      onClick={() => remove(index)}
                    />
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="primary"
                label="Add New Benefit"
                classNames="py-2 px-4"
                onClick={() => append({ value: "" })}
              />
            </div>

            <div className="border border-neutral-95 p-4 rounded-md space-y-4">
              <h3 className="text-lg font-semibold">Course Coverage</h3>

              {courseCoverageFields.map((field, index) => (
                <div key={field.id} className="relative space-y-4">
                  {courseCoverageFields.length > 1 && (
                    <FiTrash2
                      className="absolute -right-2 -top-3 text-primary-10 cursor-pointer text-lg"
                      onClick={() => removeCoverageField(index)}
                    />
                  )}

                  <TextInput
                    label="Course Coverage Title"
                    placeholder="Enter course coverage title"
                    error={errors.courseCoverage?.[index]?.title}
                    {...register(`courseCoverage.${index}.title`, {
                      required: "Title is required",
                    })}
                  />

                  <Textarea
                    label="Course Coverage Details"
                    placeholder="Enter details"
                    error={errors.courseCoverage?.[index]?.description}
                    {...register(`courseCoverage.${index}.description`, {
                      required: "Details are required",
                    })}
                  />
                </div>
              ))}

              <Button
                variant="primary"
                type="button"
                label="Add Coverage"
                classNames="py-2 px-4"
                onClick={() =>
                  appendCoverageField({
                    title: "",
                    description: "",
                  })
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Duration */}
              <TextInput
                label="Duration"
                placeholder="E.g., 12h 30m"
                error={errors.duration}
                {...register("duration", { required: "Duration is required" })}
              />

              {/* Access Type */}
              <SelectDropdown
                label="Access Type"
                {...register(`accessType`, {
                  required: "Access type is required",
                })}
                error={errors?.accessType}
                options={["Lifetime", "Limited"]}
              />
            </div>
            {/* Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput
                label="Base Price"
                placeholder="Enter base price"
                type="number"
                error={errors.basePrice}
                {...register("basePrice", {
                  required: "Base price is required",
                  valueAsNumber: true,
                })}
              />

              <TextInput
                label="Discounted Price"
                placeholder="Enter discounted price"
                type="number"
                error={errors.discountedPrice}
                {...register("discountedPrice", {
                  required: "Discounted price is required",
                  valueAsNumber: true,
                })}
              />
            </div>

            {/* File Upload */}
            {/* File Upload */}
            <div className="flex flex-col gap-2">
              <TextInput
                label="Thumbnail / Preview Image"
                placeholder="Choose file"
                type="file"
                error={errors.file}
                {...register("file")}
              />
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Course Preview"
                  className="w-40 h-40 object-cover mt-2 rounded-md border"
                />
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 mt-6">
              <Button
                variant="custom"
                label="Cancel"
                type="button"
                classNames="py-2 px-3"
                onClick={() => navigate("/dashboard/admin/courses")}
              />
              <Button
                variant="primary"
                label="Save Course"
                type="submit"
                classNames="py-2 px-3"
                isLoading={isAddingCourse || isUpdatingCourse}
              />
            </div>
          </form>
        </SubscriptionStatus>
      )}
    </div>
  );
};

export default ManageCourseForm;
