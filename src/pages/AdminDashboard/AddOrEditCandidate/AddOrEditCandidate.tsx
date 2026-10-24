// src/pages/hr/AddOrEditCandidate.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiUploadCloud,
  FiFileText,
  FiX,
  FiStar,
  FiEye,
} from "react-icons/fi";
import toast from "react-hot-toast";

import DashboardContainer from "../../../components/Dashboard/SharedComponents/DashboardContainer/DashboardContainer";
import TextInput from "../../../components/Reusable/TextInput/TextInput";
import TextArea from "../../../components/Reusable/TextArea/TextArea";
import SelectDropdown from "../../../components/Reusable/SelectDropdown/SelectDropdown";
import Button from "../../../components/Reusable/Button/Button";
import { DynamicList } from "../AddOrEditJob/AddOrEditJob";

// ---- Options ----
const SOURCE_OPTIONS = ["HR", "Referral"];
const STATUS_OPTIONS = [
  "New",
  "Screening",
  "Interview",
  "Selected",
  "Rejected",
  "Hired",
];

// Replace with real API later
const jobsMock = [
  { _id: "JOB-001", title: "Senior React Developer", department: "Engineering" },
  { _id: "JOB-002", title: "UI/UX Designer", department: "Design" },
  { _id: "JOB-003", title: "Backend Engineer (Node.js)", department: "Engineering" },
  { _id: "JOB-004", title: "QA Engineer (Intern)", department: "Engineering" },
];

// Replace with useGetCandidateByIdQuery later
const candidatesMock = [
  {
    _id: "CAND-001",
    name: "Mrinali Roy",
    email: "mrinali.roy@example.com",
    phone: "+91 98765 43201",
    jobId: "JOB-001",
    jobTitle: "Senior React Developer",
    department: "Engineering",
    experience: 5,
    resumeUrl: "/mock/resumes/mrinali.pdf",
    resumeFileName: "Mrinali_Roy_CV.pdf",
    source: "HR",
    referredBy: "",
    rating: 8,
    status: "Interview",
    skills: ["React", "TypeScript", "Redux"],
    notes: "",
  },
];

export type TCandidateFormValues = {
  name: string;
  email: string;
  phone: string;
  jobId: string;
  jobTitle: string;
  department: string;
  experience: number;
  source: string;
  referredBy?: string;
  status: string;
  rating: number;
  skills: string[];
  notes: string;
};

const EMPTY: TCandidateFormValues = {
  name: "",
  email: "",
  phone: "",
  jobId: "",
  jobTitle: "",
  department: "",
  experience: 0,
  source: "HR",
  referredBy: "",
  status: "New",
  rating: 0,
  skills: [""],
  notes: "",
};

const isValidUrl = (v: string) => {
  try {
    const u = new URL(v);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
};

const AddOrEditCandidate = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const initialData = isEdit
    ? candidatesMock.find((c) => c._id === id) ?? null
    : null;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<TCandidateFormValues>({ defaultValues: EMPTY });

  const skillsArray = useFieldArray({ control, name: "skills" as any });

  // ---- Resume state ----
  const [resumeMode, setResumeMode] = useState<"upload" | "url">("upload");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string>("");
  const [resumeError, setResumeError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const selectedJobId = watch("jobId");
  const source = watch("source");
  const rating = watch("rating");

  // ---- Prefill on edit ----
  useEffect(() => {
    if (isEdit && initialData) {
      reset({
        name: initialData.name ?? "",
        email: initialData.email ?? "",
        phone: initialData.phone ?? "",
        jobId: initialData.jobId ?? "",
        jobTitle: initialData.jobTitle ?? "",
        department: initialData.department ?? "",
        experience: initialData.experience ?? 0,
        source: initialData.source ?? "HR",
        referredBy: initialData.referredBy ?? "",
        status: initialData.status ?? "New",
        rating: initialData.rating ?? 0,
        skills: initialData.skills?.length ? initialData.skills : [""],
        notes: initialData.notes ?? "",
      });

      if (initialData.resumeUrl) {
        setResumeUrl(initialData.resumeUrl);
        setResumeMode("url");
      } else if (initialData.resumeFileName) {
        setResumeFile(
          new File([], initialData.resumeFileName, { type: "application/pdf" })
        );
        setResumeMode("upload");
      }
    } else {
      reset(EMPTY);
      setResumeFile(null);
      setResumeUrl("");
      setResumeMode("upload");
    }
  }, [isEdit, initialData, reset]);

  // ---- Auto-fill job title + department ----
  useEffect(() => {
    const job = jobsMock.find((j) => j._id === selectedJobId);
    if (job) {
      setValue("jobTitle", job.title);
      setValue("department", job.department);
    }
  }, [selectedJobId, setValue]);

  // ---- Mode switch (clears the other side) ----
  const handleModeChange = (m: "upload" | "url") => {
    setResumeMode(m);
    setResumeError(null);
    if (m === "upload") setResumeUrl("");
    else clearFile();
  };

  // ---- File upload ----
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setResumeError(null);
    if (!file) {
      setResumeFile(null);
      return;
    }
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowed.includes(file.type)) {
      setResumeError("Only PDF, DOC, or DOCX files are allowed.");
      e.target.value = "";
      return;
    }
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
  const handleFormSubmit = async (data: TCandidateFormValues) => {
    const hasResume =
      (resumeMode === "upload" && !!resumeFile) ||
      (resumeMode === "url" && resumeUrl.trim() !== "");

    if (!hasResume && !isEdit) {
      setResumeError(
        resumeMode === "upload"
          ? "Please upload a resume file."
          : "Please enter a resume URL."
      );
      return;
    }

    if (resumeMode === "url" && resumeUrl.trim() && !isValidUrl(resumeUrl.trim())) {
      setResumeError("Please enter a valid URL (e.g. https://...)");
      return;
    }

    const cleaned = {
      ...data,
      experience: Number(data.experience) || 0,
      rating: Number(data.rating) || 0,
      skills: (data.skills || []).map((s) => s.trim()).filter(Boolean),
      referredBy: data.source === "Referral" ? data.referredBy : "",
      resume:
        resumeMode === "upload"
          ? { type: "file" as const, file: resumeFile }
          : { type: "url" as const, url: resumeUrl.trim() },
    };

    console.log("Submit:", cleaned);

    await new Promise((r) => setTimeout(r, 500));
    toast.success(
      isEdit ? "Candidate updated successfully." : "Candidate added successfully."
    );
    navigate("/hr/applications");
  };

  return (
    <div className="font-Montserrat">
      {/* ---- Back ---- */}
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
            {isEdit ? "Edit Candidate" : "Add New Candidate"}
          </h1>
          <p className="text-sm text-neutral-65 mt-1">
            {isEdit
              ? "Update candidate details and save changes."
              : "Add a candidate manually or on behalf of an employee referral."}
          </p>
        </div>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex flex-col gap-8"
        >
          {/* ============================================================
           * SECTION 1 — Personal Information
           * ============================================================ */}
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
                label="Phone"
                placeholder="e.g. +91 98765 43201"
                error={errors.phone}
                isRequired
                {...register("phone", {
                  required: "Phone is required",
                  pattern: {
                    value: /^[+\d][\d\s\-()]{6,}$/,
                    message: "Enter a valid phone number",
                  },
                })}
              />
              <TextInput
                label="Experience (years)"
                type="number"
                placeholder="e.g. 5"
                error={errors.experience}
                isRequired
                {...register("experience", {
                  required: "Experience is required",
                  min: { value: 0, message: "Cannot be negative" },
                })}
              />
            </div>
          </Section>

          {/* ============================================================
           * SECTION 2 — Application Details
           * ============================================================ */}
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
              {source === "Referral" && (
                <TextInput
                  label="Referred By (Employee)"
                  placeholder="e.g. Arjun Sharma"
                  error={errors.referredBy}
                  isRequired
                  {...register("referredBy", {
                    required: "Referrer name is required",
                  })}
                />
              )}
            </div>

            {selectedJobId && (
              <div className="mt-3 text-xs text-neutral-65">
                Department:{" "}
                <span className="font-medium text-neutral-40">
                  {watch("department") || "—"}
                </span>
              </div>
            )}
          </Section>

          {/* ============================================================
           * SECTION 3 — Evaluation
           * ============================================================ */}
          <Section title="Evaluation">
            {/* Rating */}
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
                  onChange={(e) => setValue("rating", Number(e.target.value))}
                  className="flex-1 accent-primary-10"
                />
                <span className="w-10 text-right font-semibold text-neutral-40">
                  {rating || 0}/10
                </span>
              </div>
              <input type="hidden" {...register("rating")} />
            </div>

            {/* Skills */}
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
                isRequired
                chipStyle="skill"
              />
            </div>

            {/* Notes */}
            <div className="mt-5">
              <TextArea
                label="Notes"
                placeholder="Any internal notes about this candidate..."
                isRequired={false}
                error={errors.notes}
                {...register("notes")}
              />
            </div>
          </Section>

          {/* ============================================================
           * SECTION 4 — Resume
           * ============================================================ */}
          <Section title="Resume / CV">
            <ResumeInput
              mode={resumeMode}
              onModeChange={handleModeChange}
              resumeFile={resumeFile}
              resumeUrl={resumeUrl}
              onFileChange={handleFileChange}
              onUrlChange={(url) => {
                setResumeUrl(url);
                setResumeError(null);
              }}
              onClearFile={clearFile}
              fileInputRef={fileInputRef}
              error={resumeError}
              isEdit={isEdit}
            />
          </Section>

          {/* ---------- Actions ---------- */}
          <div className="flex justify-end gap-4 pt-4 border-t border-neutral-98">
            <Button
              variant="custom"
              label="Cancel"
              type="button"
              classNames="py-2 px-4"
              onClick={() => navigate("/hr/applications")}
            />
            <Button
              variant="primary"
              label={isEdit ? "Save Changes" : "Add Candidate"}
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

export default AddOrEditCandidate;

/* ============================================================
 * Section — small heading + optional subtitle + content
 * ============================================================ */
const Section = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) => (
  <section className="flex flex-col gap-4">
    <div className="flex items-baseline gap-3 pb-2 border-b border-neutral-98">
      <h2 className="text-sm font-semibold text-neutral-40 uppercase tracking-wide">
        {title}
      </h2>
      {subtitle && <span className="text-xs text-neutral-65">{subtitle}</span>}
    </div>
    {children}
  </section>
);

/* ============================================================
 * ResumeInput — upload file OR paste URL
 * ============================================================ */
const ResumeInput = ({
  mode,
  onModeChange,
  resumeFile,
  resumeUrl,
  onFileChange,
  onUrlChange,
  onClearFile,
  fileInputRef,
  error,
  isEdit,
}: {
  mode: "upload" | "url";
  onModeChange: (m: "upload" | "url") => void;
  resumeFile: File | null;
  resumeUrl: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUrlChange: (url: string) => void;
  onClearFile: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  error: string | null;
  isEdit: boolean;
}) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Mode toggle */}
      <div className="inline-flex rounded-lg border border-neutral-98 bg-neutral-105 p-1 w-fit">
        <button
          type="button"
          onClick={() => onModeChange("upload")}
          className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${
            mode === "upload"
              ? "bg-white text-neutral-40 shadow-sm"
              : "text-neutral-65 hover:text-neutral-40"
          }`}
        >
          Upload File
        </button>
        <button
          type="button"
          onClick={() => onModeChange("url")}
          className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${
            mode === "url"
              ? "bg-white text-neutral-40 shadow-sm"
              : "text-neutral-65 hover:text-neutral-40"
          }`}
        >
          Enter URL
        </button>
      </div>

      {/* ===== Upload Mode ===== */}
      {mode === "upload" && (
        <>
          {!resumeFile ? (
            <label
              htmlFor="resume-file"
              className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-neutral-98 rounded-xl px-4 py-8 cursor-pointer hover:border-primary-10 hover:bg-neutral-105/50 transition-colors"
            >
              <FiUploadCloud size={28} className="text-neutral-50" />
              <p className="text-sm text-neutral-40 font-medium">
                Click to upload resume
              </p>
              <p className="text-xs text-neutral-65">
                {isEdit
                  ? "Upload a new file to replace the existing one"
                  : "PDF, DOC, or DOCX — max 5 MB"}
              </p>
              <input
                id="resume-file"
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={onFileChange}
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
                    {resumeFile.size > 0
                      ? `${(resumeFile.size / 1024).toFixed(0)} KB · `
                      : ""}
                    {resumeFile.type || "resume"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClearFile}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                aria-label="Remove file"
              >
                <FiX size={16} />
              </button>
            </div>
          )}
        </>
      )}

      {/* ===== URL Mode ===== */}
      {mode === "url" && (
        <div className="flex flex-col gap-2">
          <label className="block text-sm text-neutral-40">Resume URL</label>
          <div className="relative">
            <FiFileText
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-50"
            />
            <input
              type="url"
              value={resumeUrl}
              onChange={(e) => onUrlChange(e.target.value)}
              placeholder="https://drive.google.com/... or https://example.com/resume.pdf"
              className="w-full border border-neutral-95 rounded-lg pl-9 pr-3 py-3.5 text-sm text-neutral-40 placeholder:text-neutral-65 outline-none focus:border-primary-10"
            />
          </div>
          <p className="text-xs text-neutral-65">
            Paste a link to a Google Drive, Dropbox, LinkedIn, or any publicly
            accessible PDF.
          </p>

          {resumeUrl.trim() && /^https?:\/\//i.test(resumeUrl) && (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-2 text-xs text-primary-10 hover:underline w-fit"
            >
              <FiEye size={12} /> Preview link
            </a>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};