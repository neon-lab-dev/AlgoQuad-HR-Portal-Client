import { useForm } from "react-hook-form";
import TextInput from "../../../components/Reusable/TextInput/TextInput";
import Button from "../../../components/Reusable/Button/Button";
import { useState } from "react";
import { useAddLectureMutation } from "../../../redux/Features/Course/courseApi";
import toast from "react-hot-toast";

export type TLecture = {
  title: string;
  duration: string;
  description: string;
  video?: FileList;
};

const AddLecture = ({courseId, setIsAddLectureModalOpen} : { courseId: string; setIsAddLectureModalOpen: React.Dispatch<React.SetStateAction<boolean>>}) => {
   const [addLecture, { isLoading }] = useAddLectureMutation();
   const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TLecture>();

 const handleAddLecture = async (data: TLecture) => {
    const formData = new FormData();
    formData.append("courseId", courseId);
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("duration", data.duration);
    if (videoFile) {
      formData.append("file", videoFile);
    }

    const response = await addLecture(formData).unwrap();
    if (response?.success) {
      toast.success("Lecture added successfully");
      setIsAddLectureModalOpen(false);
      reset();
    }

  }

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
    }
  };

  return (
    <div className="font-Montserrat p-5">
      <form
        onSubmit={handleSubmit(handleAddLecture)}
        className="flex flex-col gap-4 mt-2"
      >
        {/* Lecture Title */}
        <TextInput
          label="Lecture Title"
          placeholder="Enter lecture title"
          error={errors.title}
          {...register("title", { required: "Title is required" })}
        />

        {/* Duration */}
        <TextInput
          label="Duration"
          placeholder="E.g., 15m"
          error={errors.duration}
          {...register("duration", { required: "Duration is required" })}
        />

        {/* Description */}
        <TextInput
          label="Description"
          placeholder="Brief about the lecture"
          error={errors.description}
          {...register("description", { required: "Description is required" })}
        />

        {/* Video Upload */}
        <div className="flex flex-col gap-2">
          <label className="font-medium text-gray-700">Upload Video</label>

          <label
            htmlFor="video-upload"
            className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-primary-10 hover:bg-primary-10/10 transition-colors"
          >
            <span className="text-gray-500">
              {videoPreview ? "Change video" : "Click to upload video"}
            </span>
            <input
              id="video-upload"
              type="file"
              accept="video/*"
              {...register("video", { required: "Video file is required" })}
              className="hidden"
              onChange={handleVideoChange}
            />
          </label>

          {/* Show uploaded video name only */}
          {videoPreview && (
            <div className="mt-2 px-3 py-2 border border-neutral-90 rounded-md bg-gray-50 text-neutral-10 text-sm font-medium truncate">
              {(document.getElementById("video-upload") as HTMLInputElement)
                ?.files?.[0]?.name || "Uploaded video"}
            </div>
          )}

          {errors.video && (
            <p className="text-red-500 text-sm mt-1">{errors.video.message}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 mt-6">
          <Button
            variant="tertiary"
            label="Cancel"
            type="button"
            classNames="py-2 px-3"
            onClick={() => setIsAddLectureModalOpen(false)}
          />
          <Button
            variant="primary"
            label="Save Lecture"
            type="submit"
            classNames="py-2 px-3"
            isLoading={isLoading}
          />
        </div>
      </form>
    </div>
  );
};

export default AddLecture;
