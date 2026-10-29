/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiArrowLeft,
  FiMail,
  FiPhone,
  FiCalendar,
  FiUser,
  FiExternalLink,
  FiStar,
  FiEdit3,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiUserCheck,
  FiFileText,
  FiBriefcase,
} from "react-icons/fi";

import DashboardContainer from "../../../../components/Dashboard/SharedComponents/DashboardContainer/DashboardContainer";
import Button from "../../../../components/Reusable/Button/Button";
import CandidateStatusBadge from "../../../../components/Reusable/CandidateStatusBadge/CandidateStatusBadge";
import { formatDate } from "../../../../utils/formatDate";
import ChangeRatingModal from "../../../../components/AdminDashboard/ApplicationDetailsPage/ChangeRatingModal/ChangeRatingModal";
import ChangeApplicationStatusModal from "../../../../components/AdminDashboard/ApplicationsPage/ChangeApplicationStatusModal/ChangeApplicationStatusModal";
import { useGetSingleApplicationByIdQuery } from "../../../../redux/Features/Application/applicationApi";
import Loader from "../../../../components/Shared/Loader/Loader";

const statusMeta: Record<
  string,
  { icon: React.ReactNode; bg: string; text: string }
> = {
  New: { icon: <FiClock />, bg: "bg-slate-100", text: "text-slate-600" },
  Screening: {
    icon: <FiUserCheck />,
    bg: "bg-yellow-100",
    text: "text-yellow-700",
  },
  Interview: { icon: <FiUser />, bg: "bg-indigo-100", text: "text-indigo-700" },
  Selected: {
    icon: <FiCheckCircle />,
    bg: "bg-teal-100",
    text: "text-teal-700",
  },
  Rejected: { icon: <FiXCircle />, bg: "bg-red-100", text: "text-red-700" },
  Hired: {
    icon: <FiCheckCircle />,
    bg: "bg-green-100",
    text: "text-green-700",
  },
};

const ApplicationDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading } = useGetSingleApplicationByIdQuery(id!);
  const application = data?.data || {};

  const [isChangeStatusModalOpen, setIsChangeStatusModalOpen] = useState(false);

  const [ratingModalOpen, setRatingModalOpen] = useState(false);

  // ---- Resume: open URL in a new tab ----
  const handleOpenResume = () => {
    if (!application.resumeUrl) {
      toast.error("No resume available.");
      return;
    }
    window.open(application.resumeUrl, "_blank", "noopener,noreferrer");
  };

  const initials = (application.name || "")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (isLoading)
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <Loader />
      </div>
    );

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

        <Button
          variant="primary"
          onClick={() => setIsChangeStatusModalOpen(true)}
          label="Change Status"
          classNames="py-2 px-3 border-2 border-primary-10"
        />
      </div>

      {/* ====================================================================
       * HEADER CARD — identity, contact, source, ID (no empty space)
       * ==================================================================== */}
      <DashboardContainer>
        <div className="flex flex-col md:flex-row items-start gap-5">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-2xl bg-primary-10 text-white flex items-center justify-center text-xl font-bold shrink-0 shadow-sm">
            {initials || "?"}
          </div>

          {/* Info block */}
          <div className="flex-1 min-w-0">
            {/* Name + status */}
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-neutral-40 truncate">
                {application.name || "—"}
              </h1>
              <CandidateStatusBadge status={application.status} />
            </div>

            {/* Job title + department + applied date on one line */}
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-neutral-65">
              {application.jobTitle && (
                <span className="inline-flex items-center gap-1.5">
                  <FiBriefcase size={13} className="text-neutral-50" />
                  {application.jobTitle}
                </span>
              )}
              {application.department && (
                <>
                  <span className="text-neutral-50/50">·</span>
                  <span>{application.department}</span>
                </>
              )}
              <span className="text-neutral-50/50">·</span>
              <span>Applied {formatDate(application.createdAt)}</span>
            </div>

            {/* Contact row */}
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-neutral-65">
              <a
                href={`mailto:${application.email}`}
                className="inline-flex items-center gap-2 hover:text-primary-10 transition-colors"
              >
                <FiMail size={14} className="text-neutral-50" />
                {application.email}
              </a>

              <a
                href={`tel:${application.phoneNumber}`}
                className="inline-flex items-center gap-2 hover:text-primary-10 transition-colors"
              >
                <FiPhone size={14} className="text-neutral-50" />
                {application.phoneNumber}
              </a>

              <span className="inline-flex items-center gap-2">
                <FiCalendar size={14} className="text-neutral-50" />
                {application.experience} yrs exp
              </span>
            </div>

            {/* Pills row */}
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                <FiUser size={11} />
                {application.referredBy
                  ? `Referred · ${application.referredBy?.name}`
                  : "Direct Application"}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-105 text-neutral-50 border border-neutral-98">
                ID: {application._id || "—"}
              </span>
            </div>
          </div>
        </div>
      </DashboardContainer>

      {/* ====================================================================
       * SIDE-BY-SIDE CARDS — Rating + Resume (below header)
       * ==================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
                setRatingModalOpen(true);
              }}
              className="text-primary-10 text-xs font-medium hover:underline inline-flex items-center gap-1"
            >
              <FiEdit3 size={12} /> Edit
            </button>
          </div>

          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-neutral-40 leading-none">
              {application?.resumeRating}
            </span>
            <span className="text-sm text-neutral-65 pb-0.5">/ 10</span>
          </div>

          <div className="mt-3 h-2 bg-neutral-98 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-primary-10 rounded-full transition-all duration-500"
              style={{ width: `${(application?.resumeRating / 10) * 100}%` }}
            />
          </div>

          <p className="mt-2 text-xs text-neutral-65">
            {application?.resumeRating >= 8
              ? "Excellent match"
              : application?.resumeRating >= 6
                ? "Good match"
                : application?.resumeRating >= 4
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
                {application.resumeFileName || "Resume"}
              </p>
              <p className="text-xs text-neutral-65 mt-0.5">
                {application.resumeUrl
                  ? "Click to open in a new tab"
                  : "No resume uploaded"}
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenResume}
            disabled={!application.resumeUrl}
            className={`mt-3 w-full flex items-center justify-center gap-1.5 text-xs py-2.5 rounded-lg font-medium transition-opacity ${
              application.resumeUrl
                ? "bg-primary-10 text-white hover:opacity-90"
                : "bg-neutral-105 text-neutral-65 cursor-not-allowed"
            }`}
          >
            <FiExternalLink size={14} />
            {application.resumeUrl ? "View Resume" : "No Resume"}
          </button>
        </div>
      </div>

      {/* ---- Timeline ---- */}
      <div className="mt-4">
        <DashboardContainer>
          <h2 className="text-lg font-bold text-neutral-40 mb-4">
            Recruitment Timeline
          </h2>

          {application?.history?.length ? (
            <ol className="relative border-l-2 border-neutral-98 ml-3 space-y-6">
              {application.history.map((entry: any, idx: number) => {
                const meta = statusMeta[entry.status] ?? statusMeta.New;
                return (
                  <li key={idx} className="ml-6">
                    <span
                      className={`absolute -left-3.5 flex items-center justify-center w-7 h-7 rounded-full ring-4 ring-white ${meta.bg} ${meta.text}`}
                    >
                      <span className="text-[12px]">{meta.icon}</span>
                    </span>

                    <div className="flex flex-wrap items-center gap-2">
                      <CandidateStatusBadge status={entry.status} />
                      <span className="text-xs text-neutral-65">
                        {formatDate(entry.at)}
                      </span>
                    </div>

                    {entry.note && (
                      <p className="text-sm text-neutral-65 mt-1 italic">
                        "{entry.note}"
                      </p>
                    )}
                  </li>
                );
              })}
            </ol>
          ) : (
            <p className="text-sm text-neutral-65">No status history yet.</p>
          )}
        </DashboardContainer>
      </div>

      {/* ---- Rating Modal ---- */}
      <ChangeRatingModal
        isModalOpen={ratingModalOpen}
        setIsModalOpen={setRatingModalOpen}
        currentRating={application?.resumeRating}
        candidateName={application.name}
        applicationId={application._id}
      />

      <ChangeApplicationStatusModal
        isModalOpen={isChangeStatusModalOpen}
        setIsModalOpen={setIsChangeStatusModalOpen}
        selectedApplicationId={application._id}
      />
    </div>
  );
};

export default ApplicationDetails;
