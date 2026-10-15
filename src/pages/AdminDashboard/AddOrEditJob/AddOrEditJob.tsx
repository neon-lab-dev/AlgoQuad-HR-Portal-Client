// src/pages/hr/AddOrEditJob.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { FiX, FiArrowLeft } from "react-icons/fi";
import toast from "react-hot-toast";

import DashboardContainer from "../../../components/Dashboard/SharedComponents/DashboardContainer/DashboardContainer";
import TextInput from "../../../components/Reusable/TextInput/TextInput";
import TextArea from "../../../components/Reusable/TextArea/TextArea";
import SelectDropdown from "../../../components/Reusable/SelectDropdown/SelectDropdown";
import Button from "../../../components/Reusable/Button/Button";

const DEPARTMENT_OPTIONS = [
  "Development",
  "Sales",
  "Customer Support",
  "Product Management",
  "Quality Assurance",
  "Content Writing",
  "Customer Service",
  "IT",
  "Business Development",
  "Marketing",
  "Engineering",
  "Design",
  "Marketing",
  "HR",
  "Finance",
  "Operations",
];

const EMPLOYMENT_TYPE_OPTIONS = [
  "Full-time",
  "Part-time",
  "Contract",
];

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
  skills: [],
  responsibilities: [],
  qualifications: [],
};

// ---- Mock: replace with useGetJobByIdQuery later ----
const jobsMock = [
  {
    _id: "JOB-001",
    title: "Senior React Developer",
    department: "Engineering",
    openings: 2,
    location: "Dhaka, Bangladesh",
    employmentType: "Full-time",
    status: "Active",
    description: "Build and maintain our core web platform.",
    skills: ["React", "TypeScript", "Redux", "Tailwind"],
    responsibilities: [
      "Design and build reusable React components",
      "Collaborate with backend to shape APIs",
    ],
    qualifications: [
      "5+ years of front-end experience",
      "Strong TypeScript knowledge",
    ],
  },
  // ...other jobs
];

const AddOrEditJob = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  // Replace with: const { data: jobData } = useGetJobByIdQuery(id!, { skip: !id })
  const initialData = isEdit
    ? (jobsMock.find((j) => j._id === id) ?? null)
    : null;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TJobFormValues>({ defaultValues: EMPTY });

  const skillsArray = useFieldArray({ control, name: "skills" as never });
  const respArray = useFieldArray({
    control,
    name: "responsibilities" as never,
  });
  const qualArray = useFieldArray({ control, name: "qualifications" as never });

  // ---- Prefill in edit mode ----
  useEffect(() => {
    if (isEdit && initialData) {
      reset({ ...EMPTY, ...(initialData as any) });
    } else {
      reset(EMPTY);
    }
  }, [isEdit, initialData, reset]);

  const handleFormSubmit = async (data: TJobFormValues) => {
    console.log(data);

    // Replace with real mutation:
    // if (isEdit) await updateJob({ id, ...cleaned }).unwrap();
    // else await createJob(cleaned).unwrap();

    await new Promise((r) => setTimeout(r, 500)); // simulate network
    toast.success(
      isEdit ? "Job updated successfully." : "Job created successfully.",
    );
    navigate("/hr/jobs");
  };

  return (
    <div className="font-Montserrat">
      {/* ---- Back + heading ---- */}
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
          {/* ---------- Row: Title + Department ---------- */}
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
              placeholder="e.g. Dhaka, Bangladesh / Remote"
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
            chipStyle="skill" // ← pill style for skills
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
            chipStyle="line" // ← rectangular chips for longer text
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
              onClick={() => navigate("/hr/jobs")}
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

/*
 * DynamicList — reusable for skills / responsibilities / qualifications

/* eslint-disable @typescript-eslint/no-explicit-any */

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
  /** If true, chips are rounded/tinted (best for skills). Default false → rectangular neutral chips. */
  chipStyle?: "skill" | "line";
};

const DynamicList: React.FC<TDynamicListProps> = ({
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

  // Register a hidden field per row so react-hook-form validation still works.
  // We use register on a hidden input for each array item + setValue to write chips.
  useEffect(() => {
    // Ensure at least one row exists so RHF tracks the array
    if (fields.length === 0) onAdd();
  }, [fields.length, onAdd]);

  // Keep the RHF array and the chip list in sync
  const commitDraft = () => {
    const raw = draft.trim();
    if (!raw) return;

    // Split on commas so "React, Vue" creates two chips
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
      if (i > 0) onAdd(); // add an extra row for each additional part
      setValue(`${name}.${idx}` as any, part, {
        shouldDirty: true,
        shouldValidate: true,
      });
    });

    // Add a fresh empty row so the user can keep typing
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
      // Remove last non-empty chip if input is empty
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
    // If it's the last row and it's now empty, keep it (as the "typing" row)
  };

  // Only render chips for non-empty values
  const chips = values
    .map((v, i) => ({ value: (v || "").trim(), index: i }))
    .filter((c) => c.value !== "");

  // Total count of committed chips
  const totalCount = chips.length;

  return (
    <div>
      {/* Label + count */}
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm text-neutral-40">
          {label}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
        <span className="text-xs text-neutral-65">{totalCount} added</span>
      </div>

      {/* Tag-input container */}
      <div
        className="flex flex-wrap items-center gap-2 focus-within:border-primary-10 cursor-text px-4 py-3.5 rounded-lg bg-white border-2 border-neutral-95 focus:border-neutral-25 relative leading-[18px] focus:outline-none transition duration-300"
        onClick={() => inputRef.current?.focus()}
      >
        {/* Existing chips */}
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

        {/* The typing input */}
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

        {/* Hidden inputs so RHF knows about every item (keeps validation happy) */}
        {fields.map((field, idx) => (
          <input
            key={field.id}
            type="hidden"
            {...register(`${name}.${idx}` as any)}
          />
        ))}
      </div>

      {/* Hint */}
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

      {/* Error */}
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
