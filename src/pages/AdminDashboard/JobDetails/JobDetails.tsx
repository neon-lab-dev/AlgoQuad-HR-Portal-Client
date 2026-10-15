// src/pages/hr/JobDetails.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiArrowLeft,
  FiBriefcase,
  FiMapPin,
  FiUsers,
  FiCalendar,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";

import DashboardContainer from "../../../components/Dashboard/SharedComponents/DashboardContainer/DashboardContainer";
import Button from "../../../components/Reusable/Button/Button";
import JobStatusBadge from "../../../components/Reusable/JobStatusBadge/JobStatusBadge";
import { formatDate } from "../../../utils/formatDate";

// ---- Mock (replace with useGetJobByIdQuery later) ----
const jobsMock = [
  {
    _id: "JOB-001",
    title: "Senior React Developer",
    department: "Engineering",
    openings: 2,
    description:
      "We are looking for a Senior React Developer to help build and scale our core recruitment platform. You will work closely with design, backend, and product to ship clean, maintainable features used by HR teams across the company.",
    responsibilities: [
      "Design and build reusable React components",
      "Collaborate with backend to shape APIs",
      "Mentor junior developers",
      "Own code quality and performance",
    ],
    skills: ["React", "TypeScript", "Redux", "Tailwind", "REST APIs"],
    qualifications: [
      "5+ years of front-end experience",
      "Strong TypeScript knowledge",
      "Experience with design systems",
    ],
    location: "Dhaka, Bangladesh",
    employmentType: "Full-time",
    status: "Active",
    isReferralEnabled: true,
    createdBy: "Sadia Islam",
    createdAt: "2025-09-01T10:00:00Z",
    updatedAt: "2025-09-10T14:00:00Z",
  },
  // ... other jobs
];

const candidatesForJobMock = [
  {
    _id: "CAND-001",
    name: "Ayesha Rahman",
    email: "ayesha@example.com",
    phone: "+8801700000001",
    experience: 5,
    source: "HR",
    referredBy: null,
    rating: 8,
    status: "Interview",
    createdAt: "2025-09-10T09:00:00Z",
  },
  {
    _id: "CAND-003",
    name: "Nusrat Jahan",
    email: "nusrat@example.com",
    phone: "+8801700000003",
    experience: 7,
    source: "HR",
    referredBy: null,
    rating: 9,
    status: "Selected",
    createdAt: "2025-09-08T08:00:00Z",
  },
  {
    _id: "CAND-005",
    name: "Fahim Chowdhury",
    email: "fahim@example.com",
    phone: "+8801700000005",
    experience: 6,
    source: "HR",
    referredBy: null,
    rating: 7,
    status: "Hired",
    createdAt: "2025-08-28T09:00:00Z",
  },
];

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Replace with: const { data } = useGetJobByIdQuery(id!);
  const job = useMemo(
    () => jobsMock.find((j) => j._id === id) || jobsMock[0],
    [id]
  );

  // Replace with: useGetAllCandidatesQuery({ jobId: id })
  const candidates = candidatesForJobMock;

  const [status, setStatus] = useState(job.status);

  // ---- Pipeline stats ----
  const pipeline = {
    total: candidates.length,
    new: candidates.filter((c) => c.status === "New").length,
    screening: candidates.filter((c) => c.status === "Screening").length,
    interview: candidates.filter((c) => c.status === "Interview").length,
    selected: candidates.filter((c) => c.status === "Selected").length,
    rejected: candidates.filter((c) => c.status === "Rejected").length,
    hired: candidates.filter((c) => c.status === "Hired").length,
  };

  // ---- Handlers ----
  const handleStatusChange = (next: string) => {
    setStatus(next);
    toast.success(`Job marked as ${next}.`);
  };

  return (
    <div className="font-Montserrat">
      {/* ---- Back + header ---- */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-neutral-40 hover:text-neutral-30 text-sm"
        >
          <FiArrowLeft />
          Back to Jobs
        </button>

        <div className="flex items-center gap-3 flex-wrap">
          
          <Button
            variant="secondary"
            onClick={() => navigate(`/hr/jobs/edit/${job._id}`)}
            label="View Applications"
            classNames="py-2 px-3"
          />
          <Button
            variant="secondary"
            onClick={() => navigate(`/hr/jobs/edit/${job._id}`)}
            label="Edit Job"
            classNames="py-2 px-3"
          />
          {status !== "Active" && (
            <Button
              variant="primary"
              onClick={() => handleStatusChange("Active")}
              label="Activate"
              classNames="py-2 px-3 border-2 border-primary-10"
            />
          )}
          {status === "Active" && (
            <Button
              variant="primary"
              onClick={() => handleStatusChange("Closed")}
              label="Close Job"
              classNames="py-2 px-3 border-2 border-primary-10"
            />
          )}
        </div>
      </div>

      {/* ---- Job header card ---- */}
      <DashboardContainer>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 min-w-0">
            {/* Title + badges */}
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-neutral-40">
                {job.title}
              </h1>
              <JobStatusBadge status={status as any} />
            </div>

            <p className="text-sm text-neutral-65 mt-1">
              {job._id} · Created by {job.createdBy} ·{" "}
              {formatDate(job.createdAt)}
            </p>

            {/* Meta strip */}
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-neutral-65">
              <span className="inline-flex items-center gap-2">
                <FiBriefcase size={15} className="text-neutral-50" />
                {job.department}
              </span>
              <span className="inline-flex items-center gap-2">
                <FiMapPin size={15} className="text-neutral-50" />
                {job.location}
              </span>
              <span className="inline-flex items-center gap-2">
                <FiUsers size={15} className="text-neutral-50" />
                {job.openings} opening{job.openings > 1 ? "s" : ""}
              </span>
              <span className="inline-flex items-center gap-2">
                <FiCalendar size={15} className="text-neutral-50" />
                {job.employmentType}
              </span>
              <span className="inline-flex items-center gap-2">
                <FiClock size={15} className="text-neutral-50" />
                Updated {formatDate(job.updatedAt)}
              </span>
            </div>
          </div>

          {/* Right: quick counters */}
          <div className="lg:w-72 shrink-0 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-neutral-98 p-4">
              <p className="text-xs text-neutral-65">Openings</p>
              <p className="text-2xl font-bold text-neutral-40 mt-1">
                {job.openings}
              </p>
            </div>
            <div className="rounded-xl border border-neutral-98 p-4">
              <p className="text-xs text-neutral-65">Applicants</p>
              <p className="text-2xl font-bold text-neutral-40 mt-1">
                {pipeline.total}
              </p>
            </div>
            <div className="rounded-xl border border-neutral-98 p-4">
              <p className="text-xs text-neutral-65">In Interview</p>
              <p className="text-2xl font-bold text-indigo-600 mt-1">
                {pipeline.interview}
              </p>
            </div>
            <div className="rounded-xl border border-neutral-98 p-4">
              <p className="text-xs text-neutral-65">Hired</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {pipeline.hired}
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-neutral-98 my-6" />

        {/* Description + responsibilities + skills + qualifications */}
          {/* Left 2/3: description */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div>
              <h3 className="text-sm font-semibold text-neutral-40 uppercase tracking-wide mb-2">
                Job Description
              </h3>
              <p className="text-sm text-neutral-65 leading-relaxed">
                {job.description}
              </p>
            </div>

            <div>
            <h3 className="text-sm font-semibold text-neutral-40 uppercase tracking-wide mb-3">
              Required Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((s) => (
                <span
                  key={s}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-105 text-neutral-40 border border-neutral-98 hover:border-primary-10 hover:text-primary-10 transition-colors cursor-default"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

            {job.responsibilities?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-neutral-40 uppercase tracking-wide mb-2">
                  Responsibilities
                </h3>
                <ul className="flex flex-col gap-2">
                  {job.responsibilities.map((r, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-neutral-65"
                    >
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary-10 shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {job.qualifications?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-neutral-40 uppercase tracking-wide mb-2">
                  Qualifications
                </h3>
                <ul className="flex flex-col gap-2">
                  {job.qualifications.map((q, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-neutral-65"
                    >
                      <FiCheckCircle className="text-green-500 mt-0.5 shrink-0" size={14} />
                      {q}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
      </DashboardContainer>
    </div>
  );
};

export default JobDetails;