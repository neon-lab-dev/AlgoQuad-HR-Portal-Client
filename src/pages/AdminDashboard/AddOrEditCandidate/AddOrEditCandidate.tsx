// src/pages/hr/AddCandidate.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { FiArrowLeft, FiStar, FiFileText } from "react-icons/fi";
import toast from "react-hot-toast";

import DashboardContainer from "../../../components/Dashboard/SharedComponents/DashboardContainer/DashboardContainer";
import TextInput from "../../../components/Reusable/TextInput/TextInput";
import TextArea from "../../../components/Reusable/TextArea/TextArea";
import SelectDropdown from "../../../components/Reusable/SelectDropdown/SelectDropdown";
import Button from "../../../components/Reusable/Button/Button";
import { DynamicList } from "../AddOrEditJob/AddOrEditJob";
import { useAddCandidateMutation } from "../../../redux/Features/Application/applicationApi";

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
  resumeUrl: string;
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
  resumeUrl: "",
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

  // Pre-fill jobId if passed in URL (e.g., /hr/candidates/create?job=JOB-001)
  useEffect(() => {
    const jobParam = searchParams.get("job");
    if (jobParam) {
      setValue("jobId", jobParam);
    }
  }, [searchParams, setValue]);

  // ---- Submit ----
  const handleFormSubmit = async (data: TAddCandidateFormValues) => {
    // Construct exact payload matching your backend
    const payload = {
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      jobId: jobId,
      experience: data.experience,
      resumeUrl: data.resumeUrl,
      source: data.source,
      status: data.status,
      resumeRating: Number(data.resumeRating),
      skills: (data.skills || []).map((s) => s.trim()).filter(Boolean),
    };

    try {
      await addCandidate(payload).unwrap();
      toast.success("Candidate added successfully.");
      navigate(`/dashboard/admin/applications/${jobId}`); // Redirect to applications list
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

          {/* ================= SECTION 4: Resume URL ================= */}
          <Section title="Resume / CV">
            <div className="flex flex-col gap-2">
              <div className="relative">
                <FiFileText
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-50"
                />
                <input
                  type="url"
                  placeholder="https://drive.google.com/... or https://example.com/resume.pdf"
                  {...register("resumeUrl", {
                    required: "Resume URL is required",
                    pattern: {
                      value: /^https?:\/\/.+/i,
                      message:
                        "Must be a valid URL starting with http:// or https://",
                    },
                  })}
                  className="w-full border border-neutral-95 rounded-lg pl-9 pr-3 py-3.5 text-sm text-neutral-40 placeholder:text-neutral-65 outline-none focus:border-primary-10"
                />
              </div>
              <p className="text-xs text-neutral-65">
                Paste a link to a Google Drive, Dropbox, LinkedIn, or any
                publicly accessible PDF.
              </p>
              {errors.resumeUrl && (
                <p className="text-xs text-red-500">
                  {errors.resumeUrl.message}
                </p>
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
              onClick={() => navigate("/hr/applications")}
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
