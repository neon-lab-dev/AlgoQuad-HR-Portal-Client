/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  FiList,
  FiUserCheck,
  FiUserX,
  FiUsers,
  FiEdit2,
  FiEye,
  FiToggleLeft,
  FiToggleRight,
} from "react-icons/fi";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import toast from "react-hot-toast";

import StatusCard from "../../../../components/Dashboard/SharedComponents/StatusCard/StatusCard";
import DashboardContainer from "../../../../components/Dashboard/SharedComponents/DashboardContainer/DashboardContainer";
import SearchInput from "../../../../components/Reusable/SearchInput/SearchInput";
import Button from "../../../../components/Reusable/Button/Button";
import Table from "../../../../components/Reusable/Table/Table";
import { formatDate } from "../../../../utils/formatDate";
import {
  useGetAllEmployeesQuery,
  useUpdateEmployeeMutation,
} from "../../../../redux/Features/Employee/employeeApi";
import type { TEmployee } from "../../../../types/employee.types";
import { Link, useNavigate } from "react-router-dom";
import { DEPARTMENT_OPTIONS } from "../../JobManagement/AddOrEditJob/AddOrEditJob";
import { useSelector } from "react-redux";
import { useCurrentUser } from "../../../../redux/Features/Auth/authSlice";
import type { TUser } from "../../../../types/user.types";

const Employees = () => {
  const navigate = useNavigate();
  const user = useSelector(useCurrentUser) as TUser;
  // ---- State ----
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const skip = (page - 1) * limit;
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data, isLoading, isFetching } = useGetAllEmployeesQuery({
    keyword: searchValue,
    skip,
    limit,
    status: statusFilter,
    department: departmentFilter,
  });
  const employee = data?.data || [];

  const [updateEmployee] = useUpdateEmployeeMutation();

  // ---- Stats ----
  const stats = {
    total: employee.length,
    active: employee.filter((e: TEmployee) => e.accountStatus === "Active")
      .length,
    inactive: employee.filter((e: TEmployee) => e.accountStatus === "Inactive")
      .length,
    interns: employee.filter((e: TEmployee) => e.employmentType === "Intern")
      .length,
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "Active" ? "Inactive" : "Active";

    const payload = {
      accountStatus: nextStatus,
    };

    try {
      const toastId = toast.loading(`Marking account as ${nextStatus}...`);
      await updateEmployee({ id, data: payload }).unwrap();
      toast.success(`Employee portal access marked as ${nextStatus}.`, {
        id: toastId,
      });
    } catch (err: any) {
      // Show error toast if it fails
      toast.error(err?.data?.message || "Failed to update account status.");
    }
  };

  // ---- Table Data ----
  const tableData = employee?.map((emp: TEmployee) => ({
    _id: emp._id,
    name: emp.userId.name,
    profilePicture: emp.userId.profilePicture,
    employeeId: emp.employeeId,
    contact: emp.userId.email,
    department: emp.department,
    designation: emp.designation,
    joiningDate: formatDate(emp.joiningDate),
    employmentType: emp.employmentType,
    status: emp.accountStatus,
    _raw: emp,
  }));

  const columns = [
    { key: "employeeId", label: "Emp ID" },
    {
      key: "name",
      label: "Employee",
      render: (row: any) => (
        <div className="flex items-center gap-3">
          {/* Profile Picture or Fallback Initials */}
          {row.profilePicture ? (
            <img
              src={row.profilePicture}
              alt={row.name}
              className="w-10 h-10 rounded-full object-cover border border-neutral-98 shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary-10/10 text-primary-10 flex items-center justify-center font-bold text-sm shrink-0 border border-primary-10/20">
              {row.name?.charAt(0).toUpperCase()}
            </div>
          )}

          {/* Name & Email */}
          <div className="flex flex-col min-w-0">
            <span className="font-medium text-neutral-40 truncate">
              {row.name}
            </span>
            <span className="text-xs text-neutral-65 truncate">
              {row.contact}
            </span>
          </div>
        </div>
      ),
    },
    { key: "department", label: "Department" },
    { key: "designation", label: "Designation" },
    { key: "employmentType", label: "Type" },
    { key: "joiningDate", label: "Joined" },
    {
      key: "status",
      label: "Account Status",
      render: (row: any) => (
        <span
          className={`px-2 py-0.5 text-xs font-medium rounded-full border ${
            row.status === "Active"
              ? "bg-green-100 text-green-700 border-green-300"
              : "bg-red-100 text-red-700 border-red-300"
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

    const role = user?.role;

  const actions = [
    {
      icon: <FiEye />,
      label: "View Profile",
      onClick: (row: any) => navigate(`/dashboard/${role}/employee/${row._id}`),
    },
    {
      icon: <FiEdit2 />,
      label: "Edit Employee",
      onClick: (row: any) => navigate(`/dashboard/${role}/employee/edit/${row._id}`),
      className: "text-blue-600",
    },
    {
      icon: (row: any) =>
        row.status === "Active" ? <FiToggleRight /> : <FiToggleLeft />,
      label: "Toggle Access",
      onClick: (row: any) => handleToggleStatus(row._id, row.status),
      className: "text-indigo-600",
    },
  ];

  // ---- Export ----
  const handleExport = () => {
    if (!employee?.length) return;

    const exportData = employee?.map((emp: any) => {
      const user = emp.userId || {};

      return {
        // ---- Employee Model Data ----
        "Employee ID": emp.employeeId || "",
        Department: emp.department || "",
        Designation: emp.designation || "",
        "Employment Type": emp.employmentType || "",
        "Account Status": emp.accountStatus || "",
        "Joining Date": emp.joiningDate ? formatDate(emp.joiningDate) : "",

        // ---- User Model Data ----
        "Full Name": user.name || "",
        Email: user.email || "",
        "Phone Number": user.phoneNumber || "",
        Gender: user.gender || "",
        City: user.city || "",
        State: user.state || "",
        Country: user.country || "",
        "System Role": user.role || "",
        "Profile Picture URL": user.profilePicture || "",
        "Is First Login": user.isFirstLogin ? "Yes" : "No",

        // ---- Audit Timestamps ----
        "Profile Created At": emp.createdAt ? formatDate(emp.createdAt) : "",
        "Last Updated At": emp.updatedAt ? formatDate(emp.updatedAt) : "",
      };
    });

    const ws = XLSX.utils.json_to_sheet(exportData);

    // Optional: Auto-adjust column widths for better readability
    const colWidths = Object.keys(exportData[0]).map((key) => ({
      wch: Math.max(key.length, 20), // Minimum 20 characters wide
    }));
    ws["!cols"] = colWidths;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Employees");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    saveAs(
      new Blob([buf], { type: "application/octet-stream" }),
      `employees_export_${new Date().toISOString().split("T")[0]}.xlsx`,
    );
  };



  return (
    <div>
      {/* ---- Stats Row ---- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatusCard
          icon={<FiList size={28} />}
          value={stats.total}
          label="Total Employees"
          badgeText="All"
          badgeBg="bg-blue-100"
          badgeBorder="border-blue-400"
          badgeTextColor="text-blue-600"
        />
        <StatusCard
          icon={<FiUserCheck size={28} />}
          value={stats.active}
          label="Active Access"
          badgeText="Live"
          badgeBg="bg-green-100"
          badgeBorder="border-green-400"
          badgeTextColor="text-green-600"
        />
        <StatusCard
          icon={<FiUserX size={28} />}
          value={stats.inactive}
          label="Deactivated"
          badgeBg="bg-red-100"
          badgeBorder="border-red-400"
          badgeTextColor="text-red-600"
          badgeText="Revoked"
        />
        <StatusCard
          icon={<FiUsers size={28} />}
          value={stats.interns}
          label="Interns"
          badgeBg="bg-purple-100"
          badgeBorder="border-purple-400"
          badgeTextColor="text-purple-600"
          badgeText="Temp"
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
                  Employee Management
                </h1>
                <p className="text-neutral-65">
                  Manage employee accounts and portal access
                </p>
              </div>

              <div className="flex justify-between items-center gap-4 flex-wrap">
                <div className="flex items-center gap-3 md:gap-2 flex-wrap">
                  <SearchInput
                    value={searchValue}
                    onChange={(val) => {
                      setSearchValue(val);
                      setPage(1);
                    }}
                    placeholder="Search by name, email, ID..."
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
                    <option value="Active">Active</option>
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
                    {DEPARTMENT_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>

                  <Button
                    variant="secondary"
                    onClick={handleExport}
                    label="Export"
                    classNames="w-fit py-2 px-3"
                  />
                  <Link to={`/dashboard/${role}/employee/add`}>
                    <Button
                      variant="primary"
                      label="+ Add Employee"
                      classNames="w-fit py-2 px-4 border-2 border-primary-10"
                    />
                  </Link>
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
              totalPages={data?.data?.meta?.totalPages || 1}
              limit={limit}
              setLimit={setLimit}
            />
          </div>
        </DashboardContainer>
      </div>
    </div>
  );
};

export default Employees;
