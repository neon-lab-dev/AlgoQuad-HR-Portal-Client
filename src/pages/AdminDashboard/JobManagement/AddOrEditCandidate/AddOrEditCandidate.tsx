// src/pages/hr/AddCandidate.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiStar,
  FiFileText,
  FiUploadCloud,
  FiX,
} from "react-icons/fi";
import toast from "react-hot-toast";

import DashboardContainer from "../../../../components/Dashboard/SharedComponents/DashboardContainer/DashboardContainer";
import TextInput from "../../../../components/Reusable/TextInput/TextInput";
import TextArea from "../../../../components/Reusable/TextArea/TextArea";
import SelectDropdown from "../../../../components/Reusable/SelectDropdown/SelectDropdown";
import Button from "../../../../components/Reusable/Button/Button";
import { DynamicList } from "../AddOrEditJob/AddOrEditJob";
import { useAddCandidateMutation } from "../../../../redux/Features/Application/applicationApi";

// ---- Options ----
const SOURCE_OPTIONS = ["HR", "Referral", "LinkedIn", "Website"];
const STATUS_OPTIONS = [
  "New",
  "Screening",
  "Interview",
  "Selected",
  "Rejected",
  "Hired",
];

export type TAddCandidateFormValues = {
  name: string;
  email: string;
  phoneNumber: string;
  jobId: string;
  experience: string;
  source: string;
  status: string;
  resumeRating: number;
  notes: string;
  skills: string[];
};

const EMPTY: TAddCandidateFormValues = {
  name: "",
  email: "",
  phoneNumber: "",
  jobId: "",
  experience: "",
  source: "HR",
  status: "New",
  resumeRating: 0,
  notes: "",
  skills: [""],
};

const AddOrEditCandidate = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [addCandidate, { isLoading: isAdding }] = useAddCandidateMutation();

  // ---- File Upload State ----
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeError, setResumeError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<TAddCandidateFormValues>({ defaultValues: EMPTY });

  const skillsArray = useFieldArray<any>({
    control,
    name: "skills",
  });
  const rating = watch("resumeRating");

  // Pre-fill jobId if passed in URL
  useEffect(() => {
    const jobParam = searchParams.get("job");
    if (jobParam) {
      setValue("jobId", jobParam);
    }
  }, [searchParams, setValue]);

  // ---- File Upload Handler ----
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setResumeError(null);

    if (!file) {
      setResumeFile(null);
      return;
    }

    // Validate strict PDF only
    if (file.type !== "application/pdf") {
      setResumeError("Only PDF files are allowed.");
      e.target.value = "";
      return;
    }

    // Validate size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setResumeError("File must be smaller than 5 MB.");
      e.target.value = "";
      return;
    }

    setResumeFile(file);
  };

  const clearFile = () => {
    setResumeFile(null);
    setResumeError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ---- Submit ----
  const handleFormSubmit = async (data: TAddCandidateFormValues) => {
    if (!resumeFile) {
      setResumeError("Please upload the candidate's PDF resume.");
      return;
    }

    // Use FormData because we are sending a file
    const formData = new FormData();
    
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phoneNumber", data.phoneNumber);
    formData.append("jobId", jobId!); 
    formData.append("experience", data.experience);
    formData.append("source", data.source);
    formData.append("status", data.status);
    formData.append("resumeRating", String(data.resumeRating));
    formData.append("notes", data.notes);
    
    // Append skills array as a JSON string (matching your backend)
    formData.append(
      "skills", 
      JSON.stringify((data.skills || []).map((s) => s.trim()).filter(Boolean))
    );

    // Append the PDF File (Key must be "resume" to match backend multer)
    formData.append("file", resumeFile);

    try {
      await addCandidate(formData).unwrap();
      toast.success("Candidate added successfully.");
      navigate(`/dashboard/admin/applications/${jobId}`);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to add candidate.");
    }
  };

  return (
    <div className="font-Montserrat">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-neutral-40 hover:text-neutral-30 text-sm"
        >
          <FiArrowLeft />
          Back to Applications
        </button>
      </div>

      <DashboardContainer>
        <div className="mb-6">
          <h1 className="text-xl font-bold text-neutral-40">
            Add New Candidate
          </h1>
          <p className="text-sm text-neutral-65 mt-1">
            Add a candidate manually or on behalf of an employee referral.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex flex-col gap-8"
        >
          {/* ================= SECTION 1: Personal Info ================= */}
          <Section title="Personal Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput
                label="Full Name"
                placeholder="e.g. Mrinali Roy"
                error={errors.name}
                isRequired
                {...register("name", { required: "Name is required" })}
              />
              <TextInput
                label="Email"
                type="email"
                placeholder="e.g. mrinali.roy@example.com"
                error={errors.email}
                isRequired
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email",
                  },
                })}
              />
              <TextInput
                label="Phone Number"
                placeholder="e.g. +91 98765 43201"
                error={errors.phoneNumber}
                isRequired
                {...register("phoneNumber", {
                  required: "Phone is required",
                  pattern: {
                    value: /^[+\d][\d\s\-()]{6,}$/,
                    message: "Enter a valid phone number",
                  },
                })}
              />
              <TextInput
                label="Experience"
                placeholder="e.g. 5 years"
                error={errors.experience}
                isRequired
                {...register("experience", {
                  required: "Experience is required",
                })}
              />
            </div>
          </Section>

          {/* ================= SECTION 2: Application Details ================= */}
          <Section title="Application Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectDropdown
                label="Status"
                {...register("status", { required: "Status is required" })}
                error={errors.status}
                options={STATUS_OPTIONS}
              />
              <SelectDropdown
                label="Source"
                {...register("source", { required: "Source is required" })}
                error={errors.source}
                options={SOURCE_OPTIONS}
              />
            </div>
          </Section>

          {/* ================= SECTION 3: Evaluation ================= */}
          <Section title="Evaluation">
            <div>
              <label className="block text-sm text-neutral-40 mb-2">
                Initial Resume Rating (0–10)
              </label>
              <div className="flex items-center gap-3">
                <FiStar className="text-yellow-500" size={20} />
                <input
                  type="range"
                  min={0}
                  max={10}
                  step={1}
                  value={rating || 0}
                  onChange={(e) =>
                    setValue("resumeRating", Number(e.target.value))
                  }
                  className="flex-1 accent-primary-10"
                />
                <span className="w-10 text-right font-semibold text-neutral-40">
                  {rating || 0}/10
                </span>
              </div>
              <input type="hidden" {...register("resumeRating")} />
            </div>

            <div className="mt-5">
              <DynamicList
                label="Skills"
                placeholder="Type a skill and press Enter…"
                fields={skillsArray.fields as any}
                register={register}
                name="skills"
                onAdd={() => skillsArray.append("" as any)}
                onRemove={(i) => skillsArray.remove(i)}
                watch={watch}
                setValue={setValue}
                error={errors.skills as any}
                chipStyle="skill"
              />
            </div>

            <div className="mt-5">
              <TextArea
                label="Internal Notes"
                placeholder="Any internal notes about this candidate..."
                isRequired={false}
                error={errors.notes}
                {...register("notes")}
              />
            </div>
          </Section>

          {/* ================= SECTION 4: Resume Upload ================= */}
          <Section title="Resume / CV">
            <div className="flex flex-col gap-2">
              {!resumeFile ? (
                <label
                  htmlFor="resume-upload"
                  className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-neutral-98 rounded-xl px-4 py-8 cursor-pointer hover:border-primary-10 hover:bg-neutral-105/50 transition-colors"
                >
                  <FiUploadCloud size={28} className="text-neutral-50" />
                  <p className="text-sm text-neutral-40 font-medium">
                    Click to upload candidate's resume
                  </p>
                  <p className="text-xs text-neutral-65">
                    PDF format only. Max 5 MB.
                  </p>
                  <input
                    id="resume-upload"
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="flex items-center justify-between gap-3 border border-neutral-98 rounded-xl px-4 py-3 bg-neutral-105">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-12 rounded bg-white border border-neutral-98 flex items-center justify-center shrink-0">
                      <FiFileText className="text-red-500" size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-neutral-40 truncate">
                        {resumeFile.name}
                      </p>
                      <p className="text-xs text-neutral-65">
                        {(resumeFile.size / 1024).toFixed(0)} KB · PDF
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={clearFile}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                    aria-label="Remove file"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              )}
              
              {resumeError && (
                <p className="text-xs text-red-500 mt-1">{resumeError}</p>
              )}
            </div>
          </Section>

          {/* ================= ACTIONS ================= */}
          <div className="flex justify-end gap-4 pt-4 border-t border-neutral-98">
            <Button
              variant="custom"
              label="Cancel"
              type="button"
              classNames="py-2 px-4"
              onClick={() => navigate(`/dashboard/admin/applications/${jobId}`)}
            />
            <Button
              variant="primary"
              label="Add Candidate"
              type="submit"
              classNames="py-2 px-4"
              isLoading={isAdding}
            />
          </div>
        </form>
      </DashboardContainer>
    </div>
  );
};

export default AddOrEditCandidate;

/* ============================================================
 * Reusable Section Header
 * ============================================================ */
const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="flex flex-col gap-4">
    <div className="flex items-baseline gap-3 pb-2 border-b border-neutral-98">
      <h2 className="text-sm font-semibold text-neutral-40 uppercase tracking-wide">
        {title}
      </h2>
    </div>
    {children}
  </section>
);