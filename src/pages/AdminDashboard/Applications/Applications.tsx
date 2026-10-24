// src/pages/hr/Applications.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  FiUsers,
  FiClock,
  FiUserCheck,
  FiCheckCircle,
  FiXCircle,
  FiEye,
  FiDownload,
  FiEdit3,
  FiStar,
} from "react-icons/fi";
import StatusCard from "../../../components/Dashboard/SharedComponents/StatusCard/StatusCard";
import DashboardContainer from "../../../components/Dashboard/SharedComponents/DashboardContainer/DashboardContainer";
import SearchInput from "../../../components/Reusable/SearchInput/SearchInput";
import Button from "../../../components/Reusable/Button/Button";
import Table from "../../../components/Reusable/Table/Table";
import CandidateStatusBadge from "../../../components/Reusable/CandidateStatusBadge/CandidateStatusBadge";
import { formatDate } from "../../../utils/formatDate";
import { jobsMock } from "../Jobs/Jobs";
import ChangeApplicationStatusModal from "../../../components/AdminDashboard/ApplicationsPage/ChangeApplicationStatusModal/ChangeApplicationStatusModal";

const STATUS_OPTIONS = [
  "New",
  "Screening",
  "Interview",
  "Selected",
  "Rejected",
  "Hired",
];

const candidatesMock = [
  {
    _id: "CAND-001",
    name: "Mrinali Roy ",
    email: "mrinali.roy@example.com",
    phone: "+91 98765 43201",
    jobId: "JOB-001",
    jobTitle: "Senior React Developer",
    department: "Engineering",
    experience: 5,
    resumeUrl: "/mock/resumes/ayesha.pdf",
    resumeFileName: "Ayesha_Rahman_CV.pdf",
    source: "HR",
    rating: 8,
    status: "Interview",
    statusHistory: [
      {
        status: "New",
        changedBy: "Priya Menon",
        changedAt: "2025-09-10T09:00:00Z",
      },
      {
        status: "Screening",
        changedBy: "Priya Menon",
        changedAt: "2025-09-12T10:00:00Z",
      },
      {
        status: "Interview",
        changedBy: "Priya Menon",
        changedAt: "2025-09-15T14:00:00Z",
      },
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
    experience: 3,
    resumeUrl: "/mock/resumes/rohan.pdf",
    resumeFileName: "Rohan_Mehta_CV.pdf",
    source: "Referral",
    referredBy: "Arjun Sharma",
    rating: 6,
    status: "Screening",
    statusHistory: [
      {
        status: "New",
        changedBy: "Priya Menon",
        changedAt: "2025-09-12T11:00:00Z",
      },
      {
        status: "Screening",
        changedBy: "Priya Menon",
        changedAt: "2025-09-13T09:00:00Z",
      },
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
    experience: 7,
    resumeUrl: "/mock/resumes/sneha.pdf",
    resumeFileName: "Sneha_Iyer_CV.pdf",
    source: "HR",
    rating: 9,
    status: "Selected",
    statusHistory: [
      {
        status: "New",
        changedBy: "Priya Menon",
        changedAt: "2025-09-08T08:00:00Z",
      },
      {
        status: "Screening",
        changedBy: "Priya Menon",
        changedAt: "2025-09-09T10:00:00Z",
      },
      {
        status: "Interview",
        changedBy: "Priya Menon",
        changedAt: "2025-09-12T13:00:00Z",
      },
      {
        status: "Selected",
        changedBy: "Priya Menon",
        changedAt: "2025-09-18T16:30:00Z",
      },
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
    experience: 4,
    resumeUrl: "/mock/resumes/vikram.pdf",
    resumeFileName: "Vikram_Nair_CV.pdf",
    source: "Referral",
    referredBy: "Arjun Sharma",
    rating: 5,
    status: "Rejected",
    statusHistory: [
      {
        status: "New",
        changedBy: "Priya Menon",
        changedAt: "2025-09-05T09:00:00Z",
      },
      {
        status: "Screening",
        changedBy: "Priya Menon",
        changedAt: "2025-09-06T10:00:00Z",
      },
      {
        status: "Rejected",
        changedBy: "Priya Menon",
        changedAt: "2025-09-09T12:00:00Z",
        note: "Not enough backend depth",
      },
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
    experience: 6,
    resumeUrl: "/mock/resumes/aditya.pdf",
    resumeFileName: "Aditya_Kulkarni_CV.pdf",
    source: "HR",
    rating: 7,
    status: "Hired",
    statusHistory: [
      {
        status: "New",
        changedBy: "Priya Menon",
        changedAt: "2025-08-28T09:00:00Z",
      },
      {
        status: "Screening",
        changedBy: "Priya Menon",
        changedAt: "2025-08-30T10:00:00Z",
      },
      {
        status: "Interview",
        changedBy: "Priya Menon",
        changedAt: "2025-09-03T14:00:00Z",
      },
      {
        status: "Selected",
        changedBy: "Priya Menon",
        changedAt: "2025-09-07T11:00:00Z",
      },
      {
        status: "Hired",
        changedBy: "Priya Menon",
        changedAt: "2025-09-15T09:00:00Z",
      },
    ],
    createdAt: "2025-08-28T09:00:00Z",
    updatedAt: "2025-09-15T09:00:00Z",
  },
];

const Applications = () => {
  const navigate = useNavigate();

  // ---- Filter state ----
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [jobFilter, setJobFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // ---- Status-change modal state ----
  const [isChangeStatusModalOpen, setIsChangeStatusModalOpen] =
    useState<boolean>(false);

  // ---- Queries ----
  //   const { data, isLoading, isFetching } = useGetAllCandidatesQuery({
  //     keyword: searchValue,
  //     page,
  //     jobId: jobFilter,
  //     status: statusFilter,
  //     department: departmentFilter,
  //   });

  //   const { data: jobsData } = useGetAllJobsQuery({ limit: 100 });
  //   const jobs = jobsData?.data?.jobs || [];

  //   const allCandidates: TCandidate[] = data?.data?.candidates || [];

  //   const [updateCandidateStatus] = useUpdateCandidateStatusMutation();

  // ---- Top stats ----
  const stats = {
    total: candidatesMock.length || 0,
    new: candidatesMock.filter((c) => c.status === "New").length,
    screening: candidatesMock.filter((c) => c.status === "Screening").length,
    interview: candidatesMock.filter((c) => c.status === "Interview").length,
    selected: candidatesMock.filter((c) => c.status === "Selected").length,
    hired: candidatesMock.filter((c) => c.status === "Hired").length,
  };

  // ---- Handlers ----
  const openStatusModal = (row: any) => {
    console.log(row);
    setIsChangeStatusModalOpen(true);
  };

  //   const handleStatusSave = async () => {
  //     if (!statusTarget) return;
  //     if (newStatus === statusTarget.status) {
  //       toast.error("Select a different status.");
  //       return;
  //     }
  //     try {
  //       await updateCandidateStatus({
  //         id: statusTarget._id,
  //         status: newStatus,
  //         note: statusNote || undefined,
  //       }).unwrap();
  //       toast.success(`Status changed to ${newStatus}.`);
  //       setStatusModalOpen(false);
  //     } catch (err: any) {
  //       toast.error(err?.data?.message || "Failed to update status.");
  //     }
  //   };

  //   const handleDownloadResume = (row: TCandidate) => {
  //     toast.success(`Downloading ${row.resumeFileName || "resume"}...`);
  //   };

  // ---- Table data ----
  const tableData =
    candidatesMock.map((c) => ({
      _id: c._id,
      candidate: {
        name: c.name,
        email: c.email,
        phone: c.phone,
        jobTitle: c.jobTitle,
      },
      experience: `${c.experience} yrs`,
      source: c.source,
      referredBy: c.referredBy || "—",
      rating: c.rating ?? "—",
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
    { key: "referredBy", label: "Referred By" },
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
      onClick: (row: any) => navigate(`/dashboard/admin/application/${row._id}`),
    },
    {
      icon: <FiDownload />,
      label: "Download Resume",
      onClick: (row: any) => {
        if (row._raw.resumeUrl) {
          window.open(row._raw.resumeUrl, "_blank", "noopener,noreferrer");
        }
      },
      className: "text-blue-600",
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
    if (!candidatesMock.length) return;
    const exportData = candidatesMock.map((c) => ({
      ID: c._id,
      Name: c.name,
      Email: c.email,
      Phone: c.phone,
      "Applied For": c.jobTitle,
      Department: c.department,
      Experience: c.experience,
      Source: c.source,
      "Referred By": c.referredBy || "",
      Rating: c.rating ?? "",
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
                  <select
                    value={jobFilter}
                    onChange={(e) => {
                      setJobFilter(e.target.value);
                      setPage(1);
                    }}
                    className="py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary-10 focus:outline-none px-3 text-sm text-neutral-40 outline-none cursor-pointer"
                  >
                    <option value="All">All Jobs</option>
                    {jobsMock.map((j: any) => (
                      <option key={j._id} value={j._id}>
                        {j.title}
                      </option>
                    ))}
                  </select>

                  {/* Status filter (§3.6) */}
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setPage(1);
                    }}
                    className="py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary-10 focus:outline-none px-3 text-sm text-neutral-40 outline-none cursor-pointer"
                  >
                    <option value="All">All Status</option>
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
                    onClick={() => navigate("/dashboard/admin/candidate/add")}
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
              totalPages={1}
            />
          </div>
        </DashboardContainer>
      </div>

      {/* ---- Status change modal ---- */}
      <ChangeApplicationStatusModal
        isModalOpen={isChangeStatusModalOpen}
        setIsModalOpen={setIsChangeStatusModalOpen}
      />
    </div>
  );
};

export default Applications;
