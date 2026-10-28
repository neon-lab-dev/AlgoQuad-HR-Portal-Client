/* eslint-disable @typescript-eslint/no-explicit-any */
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
  FiHash,
} from "react-icons/fi";

import DashboardContainer from "../../../../components/Dashboard/SharedComponents/DashboardContainer/DashboardContainer";
import Button from "../../../../components/Reusable/Button/Button";
import JobStatusBadge from "../../../../components/Reusable/JobStatusBadge/JobStatusBadge";
import { formatDate } from "../../../../utils/formatDate";
import {
  useGetSingleJobByIdQuery,
  useUpdateJobMutation,
} from "../../../../redux/Features/Job/jobApi";
import Loader from "../../../../components/Shared/Loader/Loader";

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useGetSingleJobByIdQuery(id!);
  const job = data?.data || {};

  const [updateJob] = useUpdateJobMutation();

  const handleStatusChange = async (status: string) => {
    const data = {
      status,
    };
    toast.promise(updateJob({ id, data }).unwrap(), {
      loading: `Updating to ${status}...`,
      success: `Job marked as ${status}.`,
      error: (err: any) => err?.data?.message || "Something went wrong!",
    });
  };

  if (isLoading)
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <Loader />
      </div>
    );

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
            onClick={() => navigate(`/dashboard/admin/applications/${job._id}`)}
            label="View Applications"
            classNames="py-2 px-3"
          />
          <Button
            variant="secondary"
            onClick={() => navigate(`/dashboard/admin/job/edit/${job._id}`)}
            label="Edit Job"
            classNames="py-2 px-3"
          />
          {job?.status !== "Active" && (
            <Button
              variant="primary"
              onClick={() => handleStatusChange("Active")}
              label="Activate"
              classNames="py-2 px-3 border-2 border-primary-10"
            />
          )}
          {job?.status === "Active" && (
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
        <div>
          {/* Top Row: Title, Status, and Action Buttons (if any) */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-neutral-40">
                  {job.title}
                </h1>
                <JobStatusBadge status={job?.status as any} />
              </div>

              <p className="text-sm text-neutral-65 max-w-2xl">
                Posted{" "}
                <span className="font-medium text-neutral-40">
                  {job.createdBy}
                </span>{" "}
                on {formatDate(job.createdAt)}
              </p>
            </div>

            {/* Optional: Add Edit/Share buttons here if needed */}
            {/* <div className="flex items-center gap-2">
      <Button variant="secondary" label="Edit Job" />
    </div> */}
          </div>

          {/* Divider */}
          <div className="h-px bg-neutral-98 my-6" />

          {/* Middle Row: Quick Meta Facts Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
            {/* Department */}
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-neutral-65 uppercase tracking-wide flex items-center gap-1.5">
                <FiBriefcase size={12} /> Department
              </span>
              <span className="text-sm font-medium text-neutral-40">
                {job.department}
              </span>
            </div>

            {/* Location */}
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-neutral-65 uppercase tracking-wide flex items-center gap-1.5">
                <FiMapPin size={12} /> Location
              </span>
              <span className="text-sm font-medium text-neutral-40">
                {job.location}
              </span>
            </div>

            {/* Openings */}
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-neutral-65 uppercase tracking-wide flex items-center gap-1.5">
                <FiUsers size={12} /> Openings
              </span>
              <span className="text-sm font-medium text-neutral-40">
                {job.openings} position{job.openings > 1 ? "s" : ""}
              </span>
            </div>

            {/* Employment Type */}
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-neutral-65 uppercase tracking-wide flex items-center gap-1.5">
                <FiClock size={12} /> Type
              </span>
              <span className="text-sm font-medium text-neutral-40">
                {job.employmentType}
              </span>
            </div>
          </div>

          {/* Bottom Row: Audit Info (Subtle background) */}
          <div className="mt-8 bg-neutral-105 rounded-xl p-4 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-neutral-65 border border-neutral-98">
            <span className="flex items-center gap-1.5">
              <FiHash size={13} className="text-neutral-50" />
              <span className="font-medium text-neutral-40">Job ID:</span>{" "}
              {job._id}
            </span>

            <span className="flex items-center gap-1.5">
              <FiCalendar size={13} className="text-neutral-50" />
              <span className="font-medium text-neutral-40">Deadline:</span>
              <span className="text-orange-600 font-medium">
                {formatDate(job.applicationDeadline)}
              </span>
            </span>
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
              {job?.skills?.map((s: string) => (
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
                {job.responsibilities.map((r: string, i: number) => (
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
                {job.qualifications.map((q: string, i: number) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-neutral-65"
                  >
                    <FiCheckCircle
                      className="text-green-500 mt-0.5 shrink-0"
                      size={14}
                    />
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
