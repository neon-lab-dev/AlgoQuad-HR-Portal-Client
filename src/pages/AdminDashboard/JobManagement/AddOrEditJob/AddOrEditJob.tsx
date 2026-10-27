/* eslint-disable react-refresh/only-export-components */
// src/pages/hr/AddOrEditJob.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { FiX, FiArrowLeft } from "react-icons/fi";
import toast from "react-hot-toast";

import DashboardContainer from "../../../../components/Dashboard/SharedComponents/DashboardContainer/DashboardContainer";
import TextInput from "../../../../components/Reusable/TextInput/TextInput";
import TextArea from "../../../../components/Reusable/TextArea/TextArea";
import SelectDropdown from "../../../../components/Reusable/SelectDropdown/SelectDropdown";
import Button from "../../../../components/Reusable/Button/Button";
import {
  useGetSingleJobByIdQuery,
  usePostJobMutation,
  useUpdateJobMutation,
} from "../../../../redux/Features/Job/jobApi";

// ---- Options ----
export const DEPARTMENT_OPTIONS = [
  "Development",
  "Engineering",
  "Design",
  "Product Management",
  "Quality Assurance",
  "IT",
  "Sales",
  "Business Development",
  "Marketing",
  "Content Writing",
  "Customer Support",
  "Customer Service",
  "HR",
  "Finance",
  "Operations",
];

const EMPLOYMENT_TYPE_OPTIONS = ["Full-time", "Part-time", "Contract"];

const STATUS_OPTIONS = ["Draft", "Active", "Closed", "Inactive"];

export type TJobFormValues = {
  title: string;
  department: string;
  openings: number;
  location: string;
  employmentType: string;
  status: string;
  description: string;
  skills: string[];
  responsibilities: string[];
  qualifications: string[];
};

const EMPTY: TJobFormValues = {
  title: "",
  department: "",
  openings: 1,
  location: "",
  employmentType: "",
  status: "Draft",
  description: "",
  skills: [""],
  responsibilities: [""],
  qualifications: [""],
};

const AddOrEditJob = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  // ---- Fetch single job (edit mode only) ----
  const { data: jobData, isLoading: isLoadingJob } = useGetSingleJobByIdQuery(
    id as string,
    { skip: !isEdit }
  );
  const job = jobData?.data;

  // ---- Mutations ----
  const [postJob, { isLoading: isCreating }] = usePostJobMutation();
  const [updateJob, { isLoading: isUpdating }] = useUpdateJobMutation();
  const isSubmitting = isCreating || isUpdating;

  // ---- Form ----
  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm<TJobFormValues>({ defaultValues: EMPTY });

  const skillsArray = useFieldArray({ control, name: "skills" as never });
  const respArray = useFieldArray({
    control,
    name: "responsibilities" as never,
  });
  const qualArray = useFieldArray({ control, name: "qualifications" as never });

  // ---- Set default values ----
  useEffect(() => {
    if (!isEdit) {
      reset(EMPTY);
      return;
    }
    if (job) {
      reset({
        title: job.title ?? "",
        department: job.department ?? "",
        openings: job.openings ?? 1,
        location: job.location ?? "",
        employmentType: job.employmentType ?? "",
        status: job.status ?? "Draft",
        description: job.description ?? "",
        skills: job.skills?.length ? job.skills : [""],
        responsibilities: job.responsibilities?.length
          ? job.responsibilities
          : [""],
        qualifications: job.qualifications?.length
          ? job.qualifications
          : [""],
      });
    }
  }, [isEdit, job, reset]);

  // ---- Submit ----
  const handleFormSubmit = async (data: TJobFormValues) => {
    const cleaned = {
      title: data.title.trim(),
      department: data.department,
      openings: Number(data.openings) || 1,
      location: data.location.trim(),
      employmentType: data.employmentType,
      status: data.status,
      description: data.description.trim(),
      skills: (data.skills || []).map((s) => s.trim()).filter(Boolean),
      responsibilities: (data.responsibilities || [])
        .map((s) => s.trim())
        .filter(Boolean),
      qualifications: (data.qualifications || [])
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      if (isEdit && id) {
        await updateJob({ id, data:cleaned }).unwrap();
        toast.success("Job updated successfully.");
      } else {
        await postJob(cleaned).unwrap();
        toast.success("Job created successfully.");
      }
      navigate("/dashboard/admin/jobs");
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong.");
    }
  };

  // ---- Loading state for edit ----
  if (isEdit && isLoadingJob) {
    return (
      <div className="font-Montserrat flex items-center justify-center py-20 text-neutral-65 text-sm">
        Loading job details…
      </div>
    );
  }

  return (
    <div className="font-Montserrat">
      {/* ---- Back ---- */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-neutral-40 hover:text-neutral-30 text-sm"
        >
          <FiArrowLeft />
          Back to Jobs
        </button>
      </div>

      <DashboardContainer>
        <div className="mb-6">
          <h1 className="text-xl font-bold text-neutral-40">
            {isEdit ? "Edit Job Opening" : "Create New Job"}
          </h1>
          <p className="text-sm text-neutral-65 mt-1">
            {isEdit
              ? "Update the job details and save changes."
              : "Fill in the details to create a new hiring requirement."}
          </p>
        </div>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex flex-col gap-5"
        >
          {/* ---------- Row: Title + Department + Openings + Location + Type + Status ---------- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="Job Title"
              placeholder="e.g. Senior React Developer"
              error={errors.title}
              isRequired
              {...register("title", { required: "Job title is required" })}
            />

            <SelectDropdown
              label="Department"
              {...register("department", {
                required: "Department is required",
              })}
              error={errors.department}
              options={DEPARTMENT_OPTIONS}
            />

            <TextInput
              label="Number of Openings"
              type="number"
              placeholder="e.g. 2"
              error={errors.openings}
              isRequired
              {...register("openings", {
                required: "Openings is required",
                min: { value: 1, message: "Must be at least 1" },
              })}
            />

            <TextInput
              label="Location"
              placeholder="e.g. Bengaluru, India / Remote"
              error={errors.location}
              isRequired
              {...register("location", { required: "Location is required" })}
            />

            <SelectDropdown
              label="Employment Type"
              {...register("employmentType", {
                required: "Employment type is required",
              })}
              error={errors.employmentType}
              options={EMPLOYMENT_TYPE_OPTIONS}
            />

            <SelectDropdown
              label="Status"
              {...register("status", { required: "Status is required" })}
              error={errors.status}
              options={STATUS_OPTIONS}
            />
          </div>

          {/* ---------- Job Description ---------- */}
          <TextArea
            label="Job Description"
            placeholder="Describe the role, team, and what success looks like..."
            isRequired
            error={errors.description}
            {...register("description", {
              required: "Job description is required",
            })}
          />

          {/* ---------- Required Skills ---------- */}
          <DynamicList
            label="Required Skills"
            placeholder="Type a skill and press Enter…"
            fields={skillsArray.fields as any}
            register={register}
            name="skills"
            onAdd={() => skillsArray.append("" as any)}
            onRemove={(i) => skillsArray.remove(i)}
            watch={watch}
            setValue={setValue}
            error={errors.skills as any}
            isRequired
            chipStyle="skill"
          />

          {/* ---------- Responsibilities ---------- */}
          <DynamicList
            label="Responsibilities"
            placeholder="Type a responsibility and press Enter…"
            fields={respArray.fields as any}
            register={register}
            name="responsibilities"
            onAdd={() => respArray.append("" as any)}
            onRemove={(i) => respArray.remove(i)}
            watch={watch}
            setValue={setValue}
            error={errors.responsibilities as any}
            isRequired
            chipStyle="line"
          />

          {/* ---------- Qualifications ---------- */}
          <DynamicList
            label="Qualifications"
            placeholder="Type a qualification and press Enter…"
            fields={qualArray.fields as any}
            register={register}
            name="qualifications"
            onAdd={() => qualArray.append("" as any)}
            onRemove={(i) => qualArray.remove(i)}
            watch={watch}
            setValue={setValue}
            error={errors.qualifications as any}
            isRequired
            chipStyle="line"
          />

          {/* ---------- Actions ---------- */}
          <div className="flex justify-end gap-4 mt-2 pt-4 border-t border-neutral-98">
            <Button
              variant="custom"
              label="Cancel"
              type="button"
              classNames="py-2 px-4"
              onClick={() => navigate("/dashboard/admin/jobs")}
            />
            <Button
              variant="primary"
              label={isEdit ? "Save Changes" : "Create Job"}
              type="submit"
              classNames="py-2 px-4"
              isLoading={isSubmitting}
            />
          </div>
        </form>
      </DashboardContainer>
    </div>
  );
};

export default AddOrEditJob;

/* ============================================================
 * DynamicList — tag input for skills / responsibilities / quals
 * ============================================================ */
type TDynamicListProps = {
  label: string;
  placeholder: string;
  fields: { id: string }[];
  register: any;
  name: string;
  onAdd: () => void;
  onRemove: (index: number) => void;
  watch: any;
  setValue: any;
  error?: any;
  isRequired?: boolean;
  chipStyle?: "skill" | "line";
};

export const DynamicList: React.FC<TDynamicListProps> = ({
  label,
  placeholder,
  fields,
  register,
  name,
  onAdd,
  watch,
  setValue,
  error,
  isRequired = false,
  chipStyle = "line",
}) => {
  const values: string[] = watch(name) || [];
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (fields.length === 0) onAdd();
  }, [fields.length, onAdd]);

  const commitDraft = () => {
    const raw = draft.trim();
    if (!raw) return;

    const parts = raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    let lastIndex = fields.length - 1;
    if (lastIndex < 0) {
      onAdd();
      lastIndex = 0;
    }

    parts.forEach((part, i) => {
      const idx = lastIndex + i;
      if (i > 0) onAdd();
      setValue(`${name}.${idx}` as any, part, {
        shouldDirty: true,
        shouldValidate: true,
      });
    });

    onAdd();
    setDraft("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commitDraft();
      return;
    }

    if (e.key === "Backspace" && draft === "") {
      const filledIndexes = values
        .map((v, i) => (v?.trim() ? i : -1))
        .filter((i) => i !== -1);
      const last = filledIndexes[filledIndexes.length - 1];
      if (last !== undefined) removeChip(last);
    }
  };

  const removeChip = (index: number) => {
    setValue(`${name}.${index}` as any, "", {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const chips = values
    .map((v, i) => ({ value: (v || "").trim(), index: i }))
    .filter((c) => c.value !== "");

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm text-neutral-40">
          {label}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
        <span className="text-xs text-neutral-65">{chips.length} added</span>
      </div>

      <div
        className="flex flex-wrap items-center gap-2 focus-within:border-primary-10 cursor-text px-4 py-2.5 rounded-lg bg-white border-2 border-neutral-95 focus:border-neutral-25 relative focus:outline-none transition duration-300"
        onClick={() => inputRef.current?.focus()}
      >
        {chips.map((c) => (
          <span
            key={c.index}
            className={
              chipStyle === "skill"
                ? "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-primary-10/10 text-primary-10 border border-primary-10/20"
                : "inline-flex items-center gap-1.5 max-w-full px-2.5 py-1 rounded-md text-xs bg-neutral-105 text-neutral-40 border border-neutral-98"
            }
          >
            <span className="truncate">{c.value}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeChip(c.index);
              }}
              className="hover:text-red-600 transition-colors shrink-0"
              aria-label={`Remove ${c.value}`}
            >
              <FiX size={12} />
            </button>
          </span>
        ))}

        <input
          ref={inputRef}
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commitDraft}
          placeholder={chips.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] bg-transparent text-sm text-neutral-40 placeholder:text-neutral-65 outline-none py-1"
        />

        {fields.map((field, idx) => (
          <input
            key={field.id}
            type="hidden"
            {...register(`${name}.${idx}` as any)}
          />
        ))}
      </div>

      <p className="text-[11px] text-neutral-65 mt-1.5">
        Press{" "}
        <kbd className="px-1 py-0.5 rounded border border-neutral-98 bg-neutral-105 text-[10px]">
          Enter
        </kbd>{" "}
        or{" "}
        <kbd className="px-1 py-0.5 rounded border border-neutral-98 bg-neutral-105 text-[10px]">
          ,
        </kbd>{" "}
        to add. Backspace removes the last item.
      </p>

      {error && (
        <p className="text-xs text-red-500 mt-1">
          {Array.isArray(error)
            ? `Please complete the ${label.toLowerCase()}.`
            : error.message}
        </p>
      )}
    </div>
  );
};