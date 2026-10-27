/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  FiUsers,
  FiClock,
  FiUserCheck,
  FiCheckCircle,
  FiXCircle,
  FiEye,
  FiEdit3,
  FiStar,
} from "react-icons/fi";
import StatusCard from "../../../../components/Dashboard/SharedComponents/StatusCard/StatusCard";
import DashboardContainer from "../../../../components/Dashboard/SharedComponents/DashboardContainer/DashboardContainer";
import SearchInput from "../../../../components/Reusable/SearchInput/SearchInput";
import Button from "../../../../components/Reusable/Button/Button";
import Table from "../../../../components/Reusable/Table/Table";
import CandidateStatusBadge from "../../../../components/Reusable/CandidateStatusBadge/CandidateStatusBadge";
import { formatDate } from "../../../../utils/formatDate";
import ChangeApplicationStatusModal from "../../../../components/AdminDashboard/ApplicationsPage/ChangeApplicationStatusModal/ChangeApplicationStatusModal";
import { useGetAllApplicationsQuery } from "../../../../redux/Features/Application/applicationApi";
import type { TApplication } from "../../../../types/application.types";

const STATUS_OPTIONS = [
  "New",
  "Screening",
  "Interview",
  "Selected",
  "Rejected",
  "Hired",
];

const Applications = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();

  // ---- Filter state ----
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const skip = (page - 1) * limit;
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApplicationId, setSelectedApplicationId] = useState<string>("");

  const { data: applications } = useGetAllApplicationsQuery({
    keyword: searchValue,
    skip,
    limit,
    status: statusFilter,
  });
  const allApplications = applications?.data?.applications || [];

  // const { data } = useGetAllJobsQuery({
  //   skip: 0,
  //   limit: 10000,
  // });
  // const allJobs = data?.data?.jobs || [];

  // ---- Status-change modal state ----
  const [isChangeStatusModalOpen, setIsChangeStatusModalOpen] =
    useState<boolean>(false);

  // ---- Top stats ----
  const stats = {
    total: allApplications?.length || 0,
    new: allApplications?.filter((c:TApplication) => c.status === "New").length,
    screening: allApplications?.filter((c:TApplication) => c.status === "Screening").length,
    interview: allApplications?.filter((c:TApplication) => c.status === "Interview").length,
    selected: allApplications?.filter((c:TApplication) => c.status === "Selected").length,
    hired: allApplications?.filter((c:TApplication) => c.status === "Hired").length,
  };

  // ---- Handlers ----
  const openStatusModal = (row: any) => {
    setSelectedApplicationId(row?._id);
    setIsChangeStatusModalOpen(true);
  };


  // ---- Table data ----
  const tableData =
    allApplications?.map((c:TApplication) => ({
      _id: c._id,
      candidate: {
        name: c.name,
        email: c.email,
        phone: c.phoneNumber,
      },
      experience: `${c.experience}`,
      source: <span className="capitalize">{c.source}</span>,
      resume:  (
        <a
          href={c.resumeUrl}
          target="_blank"
          rel="noreferrer"
          className="text-primary underline"
        >
          View Resume
        </a>
      ),
      rating: c.resumeRating ?? "—",
      status: c.status,
      appliedDate: formatDate(c.createdAt),
      _raw: c,
    })) || [];

  const columns = [
    { key: "_id", label: "ID" },
    {
      key: "candidate",
      label: "Candidate",
      render: (row: any) => (
        <div className="flex flex-col leading-tight">
          <span className="text-neutral-40 font-medium">
            {row.candidate.name}
          </span>
          <span className="text-xs text-neutral-65">{row.candidate.email}</span>
          <span className="text-xs text-neutral-65">{row.candidate.phone}</span>
        </div>
      ),
    },
    { key: "experience", label: "Exp" },
    { key: "source", label: "Source" },
    { key: "resume", label: "Resume" },
    {
      key: "rating",
      label: "Rating",
      render: (row: any) => (
        <span className="inline-flex items-center gap-1 text-neutral-40">
          <FiStar className="text-yellow-500" size={14} />
          {row.rating}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row: any) => <CandidateStatusBadge status={row.status} />,
    },
    { key: "appliedDate", label: "Applied" },
  ];

  const actions = [
  {
    icon: <FiEye />,
    label: "View Details",
    onClick: (row: any) =>
      navigate(`/dashboard/admin/application/${row._id}`),
  },
  {
    icon: <FiEdit3 />,
    label: "Change Status",
    onClick: (row: any) => openStatusModal(row._raw),
    className: "text-indigo-600",
  },
];

  // ---- Export ----
  const handleExport = () => {
    if (!allApplications?.length) return;
    const exportData = allApplications?.map((c:TApplication) => ({
      ID: c._id,
      Name: c.name,
      Email: c.email,
      Phone: c.phoneNumber,
      "Applied For": c?.jobId?.title,
      Experience: c.experience,
      Source: c.source,
      Rating: c.resumeRating ?? "",
      Status: c.status,
      "Applied Date": formatDate(c.createdAt),
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Applications");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([buf], { type: "application/octet-stream" }),
      "applications.xlsx",
    );
  };

  return (
    <div>
      {/* ---- Top stats ---- */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <StatusCard
          icon={<FiUsers size={28} />}
          value={stats.total}
          label="Total"
          badgeText="All"
          badgeBg="bg-blue-100"
          badgeBorder="border-blue-400"
          badgeTextColor="text-blue-600"
        />
        <StatusCard
          icon={<FiClock size={28} />}
          value={stats.new}
          label="New"
          badgeText="Status"
          badgeBg="bg-slate-100"
          badgeBorder="border-slate-400"
          badgeTextColor="text-slate-600"
        />
        <StatusCard
          icon={<FiUserCheck size={28} />}
          value={stats.screening}
          label="Screening"
          badgeText="Status"
          badgeBg="bg-yellow-100"
          badgeBorder="border-yellow-400"
          badgeTextColor="text-yellow-600"
        />
        <StatusCard
          icon={<FiUsers size={28} />}
          value={stats.interview}
          label="Interview"
          badgeText="Status"
          badgeBg="bg-indigo-100"
          badgeBorder="border-indigo-400"
          badgeTextColor="text-indigo-600"
        />
        <StatusCard
          icon={<FiCheckCircle size={28} />}
          value={stats.selected}
          label="Selected"
          badgeText="Status"
          badgeBg="bg-teal-100"
          badgeBorder="border-teal-400"
          badgeTextColor="text-teal-600"
        />
        <StatusCard
          icon={<FiXCircle size={28} />}
          value={stats.hired}
          label="Hired"
          badgeText="Status"
          badgeBg="bg-green-100"
          badgeBorder="border-green-400"
          badgeTextColor="text-green-600"
        />
      </div>

      {/* ---- Main panel ---- */}
      <div className="mt-6 font-Montserrat">
        <DashboardContainer>
          <div className="font-Montserrat flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row gap-5 lg:gap-0 justify-between items-start">
              <div>
                <h1 className="text-xl font-bold text-neutral-40">
                  Applications
                </h1>
                <p className="text-neutral-65">
                  All candidate applications and referrals across job openings
                </p>
              </div>

              <div className="flex justify-between items-center gap-4 flex-wrap">
                <div className="flex items-center gap-3 md:gap-2 flex-wrap">
                  <SearchInput
                    value={searchValue}
                    onChange={setSearchValue}
                    placeholder="Search by name, email, phone..."
                  />

                  {/* Job filter (§3.6) */}
                  {/* <select
                    value={jobFilter}
                    onChange={(e) => {
                      setJobFilter(e.target.value);
                      setPage(1);
                    }}
                    className="py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary-10 focus:outline-none px-3 text-sm text-neutral-40 outline-none cursor-pointer"
                  >
                    <option value="all">All Jobs</option>
                    {allJobs?.map((job: any) => (
                      <option key={job?._id} value={job?._id}>
                        {job?.title}
                      </option>
                    ))}
                  </select> */}

                  {/* Status filter (§3.6) */}
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setPage(1);
                    }}
                    className="py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary-10 focus:outline-none px-3 text-sm text-neutral-40 outline-none cursor-pointer"
                  >
                    <option value="all">All Status</option>
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>

                  <Button
                    variant="secondary"
                    onClick={handleExport}
                    label="Export"
                    classNames="w-fit py-2 px-3"
                  />
                  <Button
                    variant="primary"
                    onClick={() => navigate(`/dashboard/admin/candidate/add/${jobId}`)}
                    label="+ Add Candidate"
                    classNames="w-fit py-2 px-4 border-2 border-primary-10"
                  />
                </div>
              </div>
            </div>

            {/* Table */}
            <Table
              columns={columns}
              data={tableData}
              actions={actions}
              rowKey="_id"
              //   isLoading={isLoading || isFetching}
              page={page}
              onPageChange={setPage}
              totalPages={applications?.data?.meta?.totalPages || 1}
              limit={limit}
              setLimit={setLimit}
            />
          </div>
        </DashboardContainer>
      </div>

      {/* ---- Status change modal ---- */}
      <ChangeApplicationStatusModal
        isModalOpen={isChangeStatusModalOpen}
        setIsModalOpen={setIsChangeStatusModalOpen}
        selectedApplicationId={selectedApplicationId}
      />
    </div>
  );
};

export default Applications;
