import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiArrowLeft,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiUser,
  FiDownload,
  FiEye,
  FiStar,
  FiEdit3,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiUserCheck,
  FiFileText,
} from "react-icons/fi";

import DashboardContainer from "../../../components/Dashboard/SharedComponents/DashboardContainer/DashboardContainer";
import Button from "../../../components/Reusable/Button/Button";
import CandidateStatusBadge from "../../../components/Reusable/CandidateStatusBadge/CandidateStatusBadge";
import { formatDate } from "../../../utils/formatDate";
import ChangeRatingModal from "../../../components/AdminDashboard/ApplicationDetailsPage/ChangeRatingModal/ChangeRatingModal";

const STATUS_OPTIONS = [
  "New",
  "Screening",
  "Interview",
  "Selected",
  "Rejected",
  "Hired",
] as const;
type CandidateStatus = (typeof STATUS_OPTIONS)[number];

// ---- Mock data (replace with useGetCandidateByIdQuery later) ----
const candidatesMock = [
  {
    _id: "CAND-001",
    name: "Ananya Deshpande",
    email: "ananya.deshpande@example.com",
    phone: "+91 98765 43201",
    jobId: "JOB-001",
    jobTitle: "Senior React Developer",
    department: "Engineering",
    location: "Bengaluru, India",
    experience: 5,
    resumeUrl: "/mock/resumes/ananya.pdf",
    resumeFileName: "Ananya_Deshpande_CV.pdf",
    source: "HR",
    rating: 8,
    status: "Interview" as CandidateStatus,
    skills: ["React", "TypeScript", "Redux", "Tailwind"],
    statusHistory: [
      { status: "New",       changedBy: "Priya Menon",   changedAt: "2025-09-10T09:00:00Z", note: "Application received" },
      { status: "Screening", changedBy: "Priya Menon",   changedAt: "2025-09-12T10:00:00Z", note: "Resume shortlisted" },
      { status: "Interview", changedBy: "Priya Menon",   changedAt: "2025-09-15T14:00:00Z", note: "Technical round scheduled" },
    ],
    createdAt: "2025-09-10T09:00:00Z",
    updatedAt: "2025-09-15T14:00:00Z",
  },
  {
    _id: "CAND-002",
    name: "Rohan Mehta",
    email: "rohan.mehta@example.com",
    phone: "+91 98765 43202",
    jobId: "JOB-002",
    jobTitle: "UI/UX Designer",
    department: "Design",
    location: "Remote",
    experience: 3,
    resumeUrl: "/mock/resumes/rohan.pdf",
    resumeFileName: "Rohan_Mehta_CV.pdf",
    source: "Referral",
    referredBy: "Arjun Sharma",
    rating: 6,
    status: "Screening" as CandidateStatus,
    skills: ["Figma", "Design Systems", "Prototyping"],
    statusHistory: [
      { status: "New",       changedBy: "Priya Menon", changedAt: "2025-09-12T11:00:00Z", note: "Referred by Arjun Sharma" },
      { status: "Screening", changedBy: "Priya Menon", changedAt: "2025-09-13T09:00:00Z", note: "Portfolio reviewed" },
    ],
    createdAt: "2025-09-12T11:00:00Z",
    updatedAt: "2025-09-13T09:00:00Z",
  },
  {
    _id: "CAND-003",
    name: "Sneha Iyer",
    email: "sneha.iyer@example.com",
    phone: "+91 98765 43203",
    jobId: "JOB-001",
    jobTitle: "Senior React Developer",
    department: "Engineering",
    location: "Bengaluru, India",
    experience: 7,
    resumeUrl: "/mock/resumes/sneha.pdf",
    resumeFileName: "Sneha_Iyer_CV.pdf",
    source: "HR",
    rating: 9,
    status: "Selected" as CandidateStatus,
    skills: ["React", "Next.js", "Node.js"],
    statusHistory: [
      { status: "New",       changedBy: "Priya Menon", changedAt: "2025-09-08T08:00:00Z" },
      { status: "Screening", changedBy: "Priya Menon", changedAt: "2025-09-09T10:00:00Z" },
      { status: "Interview", changedBy: "Priya Menon", changedAt: "2025-09-12T13:00:00Z" },
      { status: "Selected",  changedBy: "Priya Menon", changedAt: "2025-09-18T16:30:00Z", note: "Strong technical + culture fit" },
    ],
    createdAt: "2025-09-08T08:00:00Z",
    updatedAt: "2025-09-18T16:30:00Z",
  },
  {
    _id: "CAND-004",
    name: "Vikram Nair",
    email: "vikram.nair@example.com",
    phone: "+91 98765 43204",
    jobId: "JOB-003",
    jobTitle: "Backend Engineer (Node.js)",
    department: "Engineering",
    location: "Hybrid — Pune, India",
    experience: 4,
    resumeUrl: "/mock/resumes/vikram.pdf",
    resumeFileName: "Vikram_Nair_CV.pdf",
    source: "Referral",
    referredBy: "Arjun Sharma",
    rating: 5,
    status: "Rejected" as CandidateStatus,
    skills: ["Node.js", "Express", "MongoDB"],
    statusHistory: [
      { status: "New",       changedBy: "Priya Menon", changedAt: "2025-09-05T09:00:00Z" },
      { status: "Screening", changedBy: "Priya Menon", changedAt: "2025-09-06T10:00:00Z" },
      { status: "Rejected",  changedBy: "Priya Menon", changedAt: "2025-09-09T12:00:00Z", note: "Not enough backend depth" },
    ],
    createdAt: "2025-09-05T09:00:00Z",
    updatedAt: "2025-09-09T12:00:00Z",
  },
  {
    _id: "CAND-005",
    name: "Aditya Kulkarni",
    email: "aditya.kulkarni@example.com",
    phone: "+91 98765 43205",
    jobId: "JOB-001",
    jobTitle: "Senior React Developer",
    department: "Engineering",
    location: "Bengaluru, India",
    experience: 6,
    resumeUrl: "/mock/resumes/aditya.pdf",
    resumeFileName: "Aditya_Kulkarni_CV.pdf",
    source: "HR",
    rating: 7,
    status: "Hired" as CandidateStatus,
    skills: ["React", "GraphQL", "AWS"],
    statusHistory: [
      { status: "New",       changedBy: "Priya Menon", changedAt: "2025-08-28T09:00:00Z" },
      { status: "Screening", changedBy: "Priya Menon", changedAt: "2025-08-30T10:00:00Z" },
      { status: "Interview", changedBy: "Priya Menon", changedAt: "2025-09-03T14:00:00Z" },
      { status: "Selected",  changedBy: "Priya Menon", changedAt: "2025-09-07T11:00:00Z" },
      { status: "Hired",     changedBy: "Priya Menon", changedAt: "2025-09-15T09:00:00Z", note: "Offer accepted" },
    ],
    createdAt: "2025-08-28T09:00:00Z",
    updatedAt: "2025-09-15T09:00:00Z",
  },
];

// ---- Status → icon/color for timeline ----
const statusMeta: Record<
  CandidateStatus,
  { icon: React.ReactNode; ring: string; bg: string; text: string }
> = {
  New:       { icon: <FiClock />,       ring: "ring-slate-300",  bg: "bg-slate-100",  text: "text-slate-600" },
  Screening: { icon: <FiUserCheck />,   ring: "ring-yellow-300", bg: "bg-yellow-100", text: "text-yellow-700" },
  Interview: { icon: <FiUser />,        ring: "ring-indigo-300", bg: "bg-indigo-100", text: "text-indigo-700" },
  Selected:  { icon: <FiCheckCircle />, ring: "ring-teal-300",   bg: "bg-teal-100",   text: "text-teal-700" },
  Rejected:  { icon: <FiXCircle />,     ring: "ring-red-300",    bg: "bg-red-100",    text: "text-red-700" },
  Hired:     { icon: <FiCheckCircle />, ring: "ring-green-300",  bg: "bg-green-100",  text: "text-green-700" },
};

const ApplicationDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Replace with: const { data, isLoading } = useGetCandidateByIdQuery(id!);
  const candidate = useMemo(
    () => candidatesMock.find((c) => c._id === id) || candidatesMock[0],
    [id]
  );

  // Local state so edits reflect immediately (no backend yet)
  const [rating, setRating] = useState<number>(candidate.rating ?? 0);
  const [status, setStatus] = useState<CandidateStatus>(candidate.status);
  const [history, setHistory] = useState(candidate.statusHistory);

  // ---- Status modal ----
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<CandidateStatus>(candidate.status);
  const [statusNote, setStatusNote] = useState("");

  // ---- Rating modal ----
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [ratingInput, setRatingInput] = useState<number>(rating);

  // ---- Handlers ----
  const handleStatusSave = () => {
    if (newStatus === status) {
      toast.error("Select a different status.");
      return;
    }
    const entry = {
      status: newStatus,
      changedBy: "Sadia Islam",
      changedAt: new Date().toISOString(),
      note: statusNote || undefined,
    };
    setHistory((h) => [...h, entry]);
    setStatus(newStatus);
    setStatusModalOpen(false);
    setStatusNote("");
    toast.success(`Status changed to ${newStatus}.`);
  };

  const handleRatingSave = () => {
    const r = Math.max(0, Math.min(10, Number(ratingInput) || 0));
    setRating(r);
    setRatingModalOpen(false);
    toast.success(`Rating updated to ${r}/10.`);
  };
  console.log(handleRatingSave);

  const handleDownloadResume = () => {
    toast.success(`Downloading ${candidate.resumeFileName}...`);
    // window.open(candidate.resumeUrl, "_blank");
  };

  const handleViewResume = () => {
    toast.success(`Opening ${candidate.resumeFileName}...`);
    // window.open(candidate.resumeUrl, "_blank");
  };

  return (
    <div className="font-Montserrat">
      {/* ---- Back + header row ---- */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-neutral-40 hover:text-neutral-30 text-sm"
        >
          <FiArrowLeft />
          Back to Applications
        </button>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            onClick={() => {
              setNewStatus(status);
              setStatusNote("");
              setStatusModalOpen(true);
            }}
            label="Change Status"
            classNames="py-2 px-3 border-2 border-primary-10"
          />
        </div>
      </div>

      {/* ---- Identity + Resume card ---- */}
      <DashboardContainer>
  <div className="flex flex-col lg:flex-row gap-8">
    {/* ---------- LEFT: Identity ---------- */}
    <div className="flex-1 min-w-0">
      {/* Avatar + name + meta */}
      <div className="flex items-start gap-5">
        {/* Avatar with online badge */}
        <div className="relative shrink-0">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-10 to-primary-20 text-white flex items-center justify-center text-2xl font-bold shadow-sm">
            {candidate.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          {/* Name + status */}
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-neutral-40 truncate">
              {candidate.name}
            </h1>
            <CandidateStatusBadge status={status} />
          </div>

          {/* Subtitle */}
          <p className="text-sm text-neutral-65 mt-1">
            <span className="font-medium text-neutral-50">
              {candidate.jobTitle}
            </span>
            <span className="mx-2 text-neutral-98">•</span>
            <span>{candidate.department}</span>
            <span className="mx-2 text-neutral-98">•</span>
            <span>Applied {formatDate(candidate.createdAt)}</span>
          </p>

          {/* Contact strip */}
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-neutral-65">
            <a
              href={`mailto:${candidate.email}`}
              className="inline-flex items-center gap-2 hover:text-primary-10 transition-colors"
            >
              <FiMail size={15} className="text-neutral-50" />
              {candidate.email}
            </a>

            <a
              href={`tel:${candidate.phone}`}
              className="inline-flex items-center gap-2 hover:text-primary-10 transition-colors"
            >
              <FiPhone size={15} className="text-neutral-50" />
              {candidate.phone}
            </a>

            <span className="inline-flex items-center gap-2">
              <FiMapPin size={15} className="text-neutral-50" />
              {candidate.location}
            </span>

            <span className="inline-flex items-center gap-2">
              <FiCalendar size={15} className="text-neutral-50" />
              {candidate.experience} yrs exp
            </span>
          </div>

          {/* Source pill row */}
          <div className="mt-4 flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
              <FiUser size={12} />
              Referred by:{" "}
              {candidate.referredBy && (
                <span className="text-blue-500">
                  · {candidate.referredBy}
                </span>
              )}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-neutral-105 text-neutral-50 border border-neutral-98">
              ID: {candidate._id}
            </span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-neutral-98 my-6" />

      {/* Skills */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-neutral-40">
            Skills & Expertise
          </h3>
          <span className="text-xs text-neutral-65">
            {candidate.skills.length} total
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {candidate.skills.map((s) => (
            <span
              key={s}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-105 text-neutral-40 border border-neutral-98 hover:border-primary-10 hover:text-primary-10 transition-colors cursor-default"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>

    {/* ---------- RIGHT: Rating + Resume ---------- */}
    <div className="lg:w-80 shrink-0 flex flex-col gap-4">
      {/* Rating card */}
      <div className="rounded-2xl border border-neutral-98 p-5 bg-gradient-to-br from-neutral-105 to-white hover:shadow-sm transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FiStar className="text-yellow-500" size={16} />
            <span className="text-xs font-semibold text-neutral-40 uppercase tracking-wide">
              Resume Rating
            </span>
          </div>
          <button
            onClick={() => {
              setRatingInput(rating);
              setRatingModalOpen(true);
            }}
            className="text-primary-10 text-xs font-medium hover:underline inline-flex items-center gap-1"
          >
            <FiEdit3 size={12} /> Edit
          </button>
        </div>

        <div className="flex items-end gap-2">
          <span className="text-4xl font-bold text-neutral-40 leading-none">
            {rating}
          </span>
          <span className="text-sm text-neutral-65 pb-0.5">/ 10</span>
        </div>

        {/* Progress */}
        <div className="mt-3 h-2 bg-neutral-98 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-yellow-400 to-primary-10 rounded-full transition-all duration-500"
            style={{ width: `${(rating / 10) * 100}%` }}
          />
        </div>

        {/* Label */}
        <p className="mt-2 text-xs text-neutral-65">
          {rating >= 8
            ? "Excellent match"
            : rating >= 6
            ? "Good match"
            : rating >= 4
            ? "Average match"
            : "Needs review"}
        </p>
      </div>

      {/* Resume card */}
      <div className="rounded-2xl border border-neutral-98 p-5 hover:shadow-sm transition-shadow">
        <div className="flex items-center gap-2 mb-3">
          <FiFileText className="text-neutral-50" size={16} />
          <span className="text-xs font-semibold text-neutral-40 uppercase tracking-wide">
            Resume / CV
          </span>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-105 border border-neutral-98">
          <div className="w-11 h-14 rounded-lg bg-white border border-neutral-98 flex flex-col items-center justify-center shrink-0">
            <FiFileText className="text-red-500" size={18} />
            <span className="text-[9px] font-bold text-red-500 mt-0.5">
              PDF
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-neutral-40 truncate">
              {candidate.resumeFileName}
            </p>
            <p className="text-xs text-neutral-65 mt-0.5">
              245 KB · Uploaded {formatDate(candidate.createdAt)}
            </p>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            onClick={handleViewResume}
            className="flex items-center justify-center gap-1.5 text-xs py-2.5 rounded-lg border border-neutral-98 text-neutral-40 hover:bg-neutral-105 hover:border-neutral-30 transition-colors font-medium"
          >
            <FiEye size={14} /> View
          </button>
          <button
            onClick={handleDownloadResume}
            className="flex items-center justify-center gap-1.5 text-xs py-2.5 rounded-lg bg-primary-10 text-white hover:opacity-90 transition-opacity font-medium"
          >
            <FiDownload size={14} /> Download
          </button>
        </div>
      </div>
    </div>
  </div>
</DashboardContainer>

      {/* ---- Timeline ---- */}
      <div className="mt-6">
        <DashboardContainer>
          <h2 className="text-lg font-bold text-neutral-40 mb-4">
            Recruitment Timeline
          </h2>

          <ol className="relative border-l-2 border-neutral-98 ml-3 space-y-6">
            {history.map((entry, idx) => {
              const meta = statusMeta[entry.status as CandidateStatus];
              return (
                <li key={idx} className="ml-6">
                  <span
                    className={`absolute -left-[14px] flex items-center justify-center w-7 h-7 rounded-full ring-4 ring-white ${meta.bg} ${meta.text}`}
                  >
                    <span className="text-[12px]">{meta.icon}</span>
                  </span>

                  <div className="flex flex-wrap items-center gap-2">
                    <CandidateStatusBadge status={entry.status} />
                    <span className="text-xs text-neutral-65">
                      {formatDate(entry.changedAt)}
                    </span>
                  </div>

                  {entry.note && (
                    <p className="text-sm text-neutral-65 mt-1 italic">
                      “{entry.note}”
                    </p>
                  )}
                </li>
              );
            })}
          </ol>
        </DashboardContainer>
      </div>

      {/* ---- Status Change Modal ---- */}
      {statusModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 font-Montserrat">
            <h2 className="text-lg font-bold text-neutral-40 mb-1">
              Change Recruitment Status
            </h2>
            <p className="text-sm text-neutral-65 mb-4">
              {candidate.name} — currently{" "}
              <span className="font-medium">{status}</span>
            </p>

            <label className="block text-sm text-neutral-40 mb-1">
              New Status
            </label>
            <select
              value={newStatus}
              onChange={(e) =>
                setNewStatus(e.target.value as CandidateStatus)
              }
              className="w-full border border-neutral-30 rounded-lg px-3 py-2 text-sm mb-4 outline-none"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <label className="block text-sm text-neutral-40 mb-1">
              Note (optional)
            </label>
            <textarea
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              rows={3}
              placeholder="Reason for status change..."
              className="w-full border border-neutral-30 rounded-lg px-3 py-2 text-sm mb-5 outline-none resize-none"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setStatusModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-neutral-30 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusSave}
                className="px-4 py-2 rounded-lg bg-primary-10 text-white text-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---- Rating Modal ---- */}
      <ChangeRatingModal
  isModalOpen={ratingModalOpen}
  setIsModalOpen={setRatingModalOpen}
  currentRating={rating}
  candidateName={candidate.name}
  onSave={(newRating) => {
    setRating(newRating);
    toast.success(`Rating updated to ${newRating}/10.`);
  }}
/>
    </div>
  );
};

export default ApplicationDetails;