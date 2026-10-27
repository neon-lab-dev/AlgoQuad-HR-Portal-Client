import { useParams, useNavigate } from "react-router-dom";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiBriefcase,
  FiCalendar,
  FiUser,
  FiArrowLeft,
  FiCheckCircle,
  FiClock,
  FiGlobe,
  FiShield,
  FiRotateCcw,
  FiUserX,
  FiUserCheck,
  FiTrash2,
} from "react-icons/fi";
import DashboardContainer from "../../../../../components/Dashboard/SharedComponents/DashboardContainer/DashboardContainer";
import Loader from "../../../../../components/Shared/Loader/Loader";
import { useGetSingleEmployeeByIdQuery, useUpdateEmployeeMutation } from "../../../../../redux/Features/Employee/employeeApi";
import { formatDate } from "../../../../../utils/formatDate";

const EmployeeProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading } = useGetSingleEmployeeByIdQuery(id!);
  const employee = data?.data;

  const = useUpdateEmployeeMutation();

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-neutral-65">
        <p className="text-lg font-semibold">Employee not found</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-primary-10 hover:underline text-sm"
        >
          Go Back
        </button>
      </div>
    );
  }

  const { userId: user } = employee;

  return (
    <div className="font-Montserrat max-w-7xl mx-auto pb-10">
      {/* Header / Back button */}
      {/* Header / Action Bar */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-neutral-40 hover:text-primary-10 transition-colors text-sm font-medium"
        >
          <FiArrowLeft />
          Back to Employees
        </button>

        {/* Right: Actions & Badges */}
        <div className="flex flex-wrap items-center gap-2">

          {/* Conditional Buttons */}
          {user?.isDeleted ? (
            <button
            //   onClick={() => {
            //     toast.success("Account restored successfully (Mock)");
            //     setIsDeleted(false);
            //   }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
            >
              <FiRotateCcw size={14} /> Restore Account
            </button>
          ) : (
            <>
              {employee?.accountStatus === "Active" ? (
                <button
                //   onClick={() => {
                //     toast.success("Account deactivated (Mock)");
                //     setAccountStatus("Inactive");
                //   }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-orange-700 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors"
                >
                  <FiUserX size={14} /> Deactivate
                </button>
              ) : (
                <button
                //   onClick={() => {
                //     toast.success("Account activated (Mock)");
                //     setAccountStatus("Active");
                //   }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <FiUserCheck size={14} /> Activate
                </button>
              )}

              <button
                // onClick={() => {
                //   if (
                //     window.confirm(
                //       "Are you sure you want to delete this account?",
                //     )
                //   ) {
                //     toast.success("Account deleted (Mock)");
                //     setIsDeleted(true);
                //   }
                // }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
              >
                <FiTrash2 size={14} /> Delete
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ================= LEFT COLUMN (Profile Card) ================= */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <DashboardContainer>
            <div className="flex flex-col items-center text-center">
              {/* Profile Picture */}
              <div className="relative w-32 h-32 mb-4 rounded-full border-4 border-white shadow-md overflow-hidden bg-neutral-105">
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-4xl text-neutral-40 font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Name & Role */}
              <h1 className="text-2xl font-bold text-neutral-40">
                {user?.name}
              </h1>
              <p className="text-primary-10 font-medium mt-1">
                {employee.designation}
              </p>
              <p className="text-sm text-neutral-65 mt-0.5">
                {employee.department} Department
              </p>

              {/* Employee ID Pill */}
              <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-neutral-105 text-neutral-50 text-xs font-mono border border-neutral-98">
                <FiShield size={12} /> ID: {employee.employeeId}
              </div>
            </div>

            <hr className="my-6 border-neutral-98" />

            {/* Contact Info */}
            <div className="flex flex-col gap-4 text-sm text-neutral-60">
              <div className="flex items-start gap-3">
                <FiMail className="text-neutral-40 mt-0.5" />
                <a
                  href={`mailto:${user?.email}`}
                  className="hover:text-primary-10 transition-colors break-all"
                >
                  {user?.email}
                </a>
              </div>
              <div className="flex items-start gap-3">
                <FiPhone className="text-neutral-40 mt-0.5" />
                <a
                  href={`tel:${user?.phoneNumber}`}
                  className="hover:text-primary-10 transition-colors"
                >
                  {user?.phoneNumber}
                </a>
              </div>
              <div className="flex items-start gap-3">
                <FiMapPin className="text-neutral-40 mt-0.5 shrink-0" />
                <span>
                  {[user?.city, user?.state, user?.country]
                    .filter(Boolean)
                    .join(", ") || "Location not specified"}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <FiGlobe className="text-neutral-40 mt-0.5 shrink-0" />
                <span className="capitalize">{user?.role}</span>
              </div>
            </div>
          </DashboardContainer>
        </div>

        {/* ================= RIGHT COLUMN (Employment Details) ================= */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Employment Details Card */}
          <DashboardContainer>
            <div className="flex items-center gap-2 border-b border-neutral-98 pb-4 mb-6">
              <FiBriefcase className="text-primary-10" size={20} />
              <h2 className="text-lg font-bold text-neutral-40">
                Employment Details
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
              <div>
                <p className="text-xs font-semibold text-neutral-65 uppercase tracking-wide mb-1">
                  Employee ID
                </p>
                <p className="text-sm font-medium text-neutral-40">
                  {employee.employeeId}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-65 uppercase tracking-wide mb-1">
                  Employment Type
                </p>
                <p className="text-sm font-medium text-neutral-40">
                  {employee.employmentType}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-65 uppercase tracking-wide mb-1">
                  Department
                </p>
                <p className="text-sm font-medium text-neutral-40">
                  {employee.department}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-65 uppercase tracking-wide mb-1">
                  Designation
                </p>
                <p className="text-sm font-medium text-neutral-40">
                  {employee.designation}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-65 uppercase tracking-wide mb-1">
                  Joining Date
                </p>
                <p className="text-sm font-medium text-neutral-40">
                  {formatDate(employee.joiningDate)}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-65 uppercase tracking-wide mb-1">
                  Account Status
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {employee.accountStatus === "Active" ? (
                    <FiCheckCircle className="text-green-500" size={14} />
                  ) : (
                    <FiClock className="text-red-500" size={14} />
                  )}
                  <p
                    className={`text-sm font-medium ${employee.accountStatus === "Active" ? "text-green-600" : "text-red-600"}`}
                  >
                    {employee.accountStatus}
                  </p>
                </div>
              </div>
            </div>
          </DashboardContainer>

          {/* Personal Details Card */}
          <DashboardContainer>
            <div className="flex items-center gap-2 border-b border-neutral-98 pb-4 mb-6">
              <FiUser className="text-primary-10" size={20} />
              <h2 className="text-lg font-bold text-neutral-40">
                Personal Information
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
              <div>
                <p className="text-xs font-semibold text-neutral-65 uppercase tracking-wide mb-1">
                  Full Name
                </p>
                <p className="text-sm font-medium text-neutral-40">
                  {user?.name}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-65 uppercase tracking-wide mb-1">
                  Gender
                </p>
                <p className="text-sm font-medium text-neutral-40">
                  {user?.gender || "Not specified"}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-65 uppercase tracking-wide mb-1">
                  City
                </p>
                <p className="text-sm font-medium text-neutral-40">
                  {user?.city || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-65 uppercase tracking-wide mb-1">
                  State
                </p>
                <p className="text-sm font-medium text-neutral-40">
                  {user?.state || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-65 uppercase tracking-wide mb-1">
                  Country
                </p>
                <p className="text-sm font-medium text-neutral-40">
                  {user?.country || "—"}
                </p>
              </div>
            </div>
          </DashboardContainer>

          {/* Timeline / Audit Trail Card */}
          <DashboardContainer>
            <div className="flex items-center gap-2 border-b border-neutral-98 pb-4 mb-6">
              <FiCalendar className="text-primary-10" size={20} />
              <h2 className="text-lg font-bold text-neutral-40">Timeline</h2>
            </div>

            <ol className="relative border-l-2 border-neutral-98 ml-3 space-y-6">
              <li className="ml-6">
                <span className="absolute -left-2 flex items-center justify-center w-4 h-4 rounded-full ring-4 ring-white bg-primary-10" />
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-neutral-40">
                    Joined the Company
                  </span>
                  <span className="text-xs text-neutral-65">
                    {formatDate(employee.joiningDate)}
                  </span>
                </div>
                <p className="text-sm text-neutral-65 mt-1">
                  Started as a{" "}
                  <span className="font-medium">{employee.designation}</span> in
                  the <span className="font-medium">{employee.department}</span>{" "}
                  department.
                </p>
              </li>

              <li className="ml-6">
                <span className="absolute -left-2 flex items-center justify-center w-4 h-4 rounded-full ring-4 ring-white bg-green-500" />
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-neutral-40">
                    Profile Created
                  </span>
                  <span className="text-xs text-neutral-65">
                    {formatDate(employee.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-neutral-65 mt-1">
                  Employee profile and portal access provisioned by HR.
                </p>
              </li>
            </ol>
          </DashboardContainer>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
