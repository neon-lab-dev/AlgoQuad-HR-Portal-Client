import {
  FiArrowLeft,
  FiBriefcase,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiMail,
  FiMapPin,
  FiPhone,
  FiShield,
  FiUser,
  FiUserCheck,
} from "react-icons/fi";
import DashboardContainer from "../../../components/Dashboard/SharedComponents/DashboardContainer/DashboardContainer";
import { formatDate } from "../../../utils/formatDate";
import { useGetMeQuery } from "../../../redux/Features/User/userApi";
import { useNavigate } from "react-router-dom";
import Loader from "../../../components/Shared/Loader/Loader";

const MyProfile = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetMeQuery({});
  const employee = data?.data || {};
  const user = data?.data?.userId || {};

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!employee || !user) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-neutral-65">
        <p className="text-lg font-semibold">Data not found</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-primary-10 hover:underline text-sm"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="font-Montserrat max-w-7xl mx-auto pb-10">
      {/* Header / Action Bar */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-neutral-40 hover:text-primary-10 transition-colors text-sm font-medium mb-6"
      >
        <FiArrowLeft />
        Go Back
      </button>

      {/* Main Content (Unchanged) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ================= LEFT COLUMN (Profile Card) ================= */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <DashboardContainer>
            <div className="flex flex-col items-center text-center">
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

              <h1 className="text-2xl font-bold text-neutral-40">
                {user?.name}
              </h1>
              <p className="text-primary-10 font-medium mt-1">
                {employee.designation}
              </p>
              <p className="text-sm text-neutral-65 mt-0.5">
                {employee.department} Department
              </p>

              <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-neutral-105 text-neutral-50 text-xs font-mono border border-neutral-98">
                <FiShield size={12} /> ID: {employee.employeeId}
              </div>
            </div>

            <hr className="my-6 border-neutral-98" />

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
                <FiUserCheck className="text-neutral-40 mt-0.5 shrink-0" />
                <span className="uppercase">{user?.role}</span>
              </div>
            </div>
          </DashboardContainer>
        </div>

        {/* ================= RIGHT COLUMN (Employment Details) ================= */}
        <div className="lg:col-span-8 flex flex-col gap-6">
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

export default MyProfile;
