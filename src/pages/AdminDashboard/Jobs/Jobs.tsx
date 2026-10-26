/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  FiList,
  FiBriefcase,
  FiCheckCircle,
  FiXCircle,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiFile,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import StatusCard from "../../../components/Dashboard/SharedComponents/StatusCard/StatusCard";
import DashboardContainer from "../../../components/Dashboard/SharedComponents/DashboardContainer/DashboardContainer";
import SearchInput from "../../../components/Reusable/SearchInput/SearchInput";
import Button from "../../../components/Reusable/Button/Button";
import Table from "../../../components/Reusable/Table/Table";
import { formatDate } from "../../../utils/formatDate";
import JobStatusBadge from "../../../components/Reusable/JobStatusBadge/JobStatusBadge";
import {
  useDeleteJobMutation,
  useGetAllJobsQuery,
  useUpdateJobMutation,
} from "../../../redux/Features/Job/jobApi";
import type { TJob } from "../../../types/job.types";
import toast from "react-hot-toast";

const Jobs = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const skip = (page - 1) * limit;
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  const [updateJob] = useUpdateJobMutation();
  const [deleteJob] = useDeleteJobMutation();

  const { data, isLoading, isFetching } = useGetAllJobsQuery({
    keyword: searchValue,
    skip,
    limit,
    status: statusFilter,
    department: departmentFilter,
  });

  const allJobs = data?.data?.jobs || [];

  // ---- Stats (top row) ----
  const stats = {
    total: allJobs?.length || 0,
    active: allJobs?.filter((j: TJob) => j.status === "Active").length,
    closed: allJobs?.filter((j: TJob) => j.status === "Closed").length,
    draft: allJobs?.filter((j: TJob) => j.status === "Draft").length,
  };

  // ---- Actions ----
  const handleDelete = async (id: string) => {
    toast.promise(deleteJob(id).unwrap(), {
      loading: "Deleting job...",
      success: "Job deleted successfully.",
      error: (err: any) => err?.data?.message || "Something went wrong!",
    });
  };

  const handleStatusChange = async (id: string, status: string) => {
    const data = {
      status,
    };
    toast.promise(updateJob({ id, data }).unwrap(), {
      loading: `Updating to ${status}...`,
      success: `Job marked as ${status}.`,
      error: (err: any) => err?.data?.message || "Something went wrong!",
    });
  };

  // ---- Table data ----
  const tableData =
    allJobs?.map((job: TJob) => ({
      _id: job._id,
      title: job.title,
      department: job.department,
      openings: job.openings,
      location: job.location,
      employmentType: job.employmentType,
      status: job.status, // rendered via custom component
      createdDate: formatDate(job.createdAt),
    })) || [];

  const columns = [
    { key: "_id", label: "Job ID" },
    { key: "title", label: "Job Title" },
    { key: "department", label: "Department" },
    { key: "openings", label: "Openings" },
    { key: "location", label: "Location" },
    { key: "employmentType", label: "Type" },
    {
      key: "status",
      label: "Status",
      render: (row: any) => <JobStatusBadge status={row.status} />,
    },
    { key: "createdDate", label: "Created" },
  ];

  const actions = [
    {
      icon: <FiEye />,
      label: "View Details",
      onClick: (row: any) => navigate(`/dashboard/admin/job/${row._id}`),
    },
    {
      icon: <FiFile />,
      label: "View Applications",
      onClick: (row: any) =>
        navigate(`/dashboard/admin/applications/${row._id}`),
    },
    {
      icon: <FiEdit2 />,
      label: "Edit",
      onClick: (row: any) => navigate(`/dashboard/admin/job/edit/${row._id}`),
      className: "text-blue-600",
    },
    {
      icon: <FiCheckCircle />,
      label: "Activate",
      onClick: (row: any) => handleStatusChange(row._id, "Active"),
      className: "text-green-600",
      hidden: (row: any) => row.status === "Active",
    },
    {
      icon: <FiXCircle />,
      label: "Close",
      onClick: (row: any) => handleStatusChange(row._id, "Closed"),
      className: "text-orange-600",
      hidden: (row: any) => row.status === "Closed",
    },
    {
      icon: <FiTrash2 />,
      label: "Delete",
      onClick: (row: any) => handleDelete(row._id),
      className: "text-red-600",
    },
  ];

  // ---- Export ----
  const handleExport = () => {
    if (!tableData?.length) return;

    const exportColumns = columns.filter((c) => c.key !== "status");

    const exportData = tableData.map((row: any) => {
      const out: Record<string, any> = {};
      exportColumns.forEach((col) => {
        out[col.label] = row[col.key] ?? "";
      });
      out["Status"] = row.status;
      return out;
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Jobs");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buf], { type: "application/octet-stream" }), "jobs.xlsx");
  };

  return (
    <div>
      {/* ---- Stats Row ---- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatusCard
          icon={<FiList size={28} />}
          value={stats.total}
          label="Total Jobs"
          badgeText="All"
          badgeBg="bg-blue-100"
          badgeBorder="border-blue-400"
          badgeTextColor="text-blue-600"
        />
        <StatusCard
          icon={<FiBriefcase size={28} />}
          value={stats.active}
          label="Active Jobs"
          badgeText="Live"
          badgeBg="bg-green-100"
          badgeBorder="border-green-400"
          badgeTextColor="text-green-600"
        />
        <StatusCard
          icon={<FiCheckCircle size={28} />}
          value={stats.closed}
          label="Closed Jobs"
          badgeText="Closed"
          badgeBg="bg-orange-100"
          badgeBorder="border-orange-400"
          badgeTextColor="text-orange-600"
        />
        <StatusCard
          icon={<FiXCircle size={28} />}
          value={stats.draft}
          label="Drafts"
          badgeText="Draft"
          badgeBg="bg-slate-100"
          badgeBorder="border-slate-400"
          badgeTextColor="text-slate-600"
        />
      </div>

      {/* ---- Main Panel ---- */}
      <div className="mt-6 font-Montserrat">
        <DashboardContainer>
          <div className="font-Montserrat flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row gap-5 lg:gap-0 justify-between items-start">
              <div>
                <h1 className="text-xl font-bold text-neutral-40">
                  Job & Hiring Management
                </h1>
                <p className="text-neutral-65">
                  Create, publish and manage all hiring requirements
                </p>
              </div>

              <div className="flex justify-between items-center gap-4 flex-wrap">
                <div className="flex items-center gap-3 md:gap-2 flex-wrap">
                  <SearchInput
                    value={searchValue}
                    onChange={setSearchValue}
                    placeholder="Search by title, dept, location..."
                  />

                  {/* Status filter */}
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setPage(1);
                    }}
                    className="py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary-10 focus:outline-none px-3 text-sm text-neutral-40 outline-none cursor-pointer"
                  >
                    <option value="all">All Status</option>
                    <option value="Draft">Draft</option>
                    <option value="Active">Active</option>
                    <option value="Closed">Closed</option>
                    <option value="Inactive">Inactive</option>
                  </select>

                  {/* Department filter */}
                  <select
                    value={departmentFilter}
                    onChange={(e) => {
                      setDepartmentFilter(e.target.value);
                      setPage(1);
                    }}
                    className="py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary-10 focus:outline-none px-3 text-sm text-neutral-40 outline-none cursor-pointer"
                  >
                    <option value="all">All Departments</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="HR">HR</option>
                  </select>

                  <Button
                    variant="secondary"
                    onClick={handleExport}
                    label="Export"
                    classNames="w-fit py-2 px-3"
                  />
                  <Button
                    variant="primary"
                    onClick={() => navigate("/dashboard/admin/jobs/create")}
                    label="+ Create Job"
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
              isLoading={isLoading || isFetching}
              page={page}
              onPageChange={setPage}
              totalPages={data?.data?.meta?.totalPages || 1} // <-- Use real pagination from API
              limit={limit} // <-- Pass down
              setLimit={setLimit} // <-- Pass down
            />
          </div>
        </DashboardContainer>
      </div>
    </div>
  );
};

export default Jobs;
