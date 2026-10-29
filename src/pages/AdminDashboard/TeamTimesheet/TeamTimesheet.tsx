/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiUsers,
  FiTrendingUp,
} from "react-icons/fi";
import DashboardContainer from "../../../components/Dashboard/SharedComponents/DashboardContainer/DashboardContainer";
import Loader from "../../../components/Shared/Loader/Loader";
import { useGetAllEmployeesQuery } from "../../../redux/Features/Employee/employeeApi";
import { useGetTimesheetOfAnEmployeeQuery } from "../../../redux/Features/Timesheet/timesheetApi";

const TeamTimesheet = () => {
  // --- State ---
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // --- Queries ---
  // 1. Fetch all employees for the dropdown
  const { data: employeesData, isLoading: isLoadingEmployees } =
    useGetAllEmployeesQuery({
      limit: 1000,
    });
  const employees = employeesData?.data || [];

  // 2. Fetch the selected employee's timesheet
  const { data: timesheetData, isLoading: isLoadingTimesheet } =
    useGetTimesheetOfAnEmployeeQuery(
      {
        id: selectedEmployeeId,
        month: currentMonth.getMonth() + 1,
        year: currentMonth.getFullYear(),
      },
      { skip: !selectedEmployeeId }, // Don't fetch until an employee is selected
    );

  const timesheet = timesheetData?.data || [];

  // Convert API array into a lookup map: { "2026-10-29": 8 }
  const timesheetMap = timesheet.reduce((acc: any, curr: any) => {
    const dateStr = new Date(curr.date).toISOString().split("T")[0];
    acc[dateStr] = curr.hours;
    return acc;
  }, {});

  // --- Calendar Logic ---
  const getDaysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) =>
    new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
  );
  const firstDay = getFirstDayOfMonth(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
  );

  const prevMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
    );
  const nextMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    );

  const monthName = currentMonth.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  // --- Stats ---
  const totalHoursLogged = Object.values(timesheetMap).reduce(
    (a: any, b: any) => a + b,
    0,
  );
  const daysLogged = Object.keys(timesheetMap).length;

  return (
    <div className="font-Montserrat pb-10">
      {/* ================= HEADER & EMPLOYEE SELECTOR ================= */}
      <DashboardContainer>
        <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-xl font-bold text-neutral-40">
              Team Timesheets
            </h1>
            <p className="text-sm text-neutral-65 mt-1">
              View logged hours for any employee across the company.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Employee Dropdown */}
            <div className="flex flex-col gap-1 w-full sm:w-64">
              <label className="text-xs font-semibold text-neutral-65 uppercase tracking-wide">
                Select Employee
              </label>
              <select
                value={selectedEmployeeId}
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
                disabled={isLoadingEmployees}
                className="w-full border border-neutral-98 rounded-lg px-3 py-2 text-sm text-neutral-40 outline-none focus:border-primary-10 bg-white cursor-pointer"
              >
                <option value="">-- Choose an employee --</option>
                {employees.map((emp: any) => (
                  <option key={emp.userId?._id} value={emp?._id}>
                    {emp.userId?.name} ({emp.employeeId})
                  </option>
                ))}
              </select>
            </div>

            {/* Month Navigator */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-neutral-65 uppercase tracking-wide">
                Month
              </label>
              <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-neutral-98">
                <button
                  onClick={prevMonth}
                  className="p-1.5 hover:bg-neutral-105 rounded-md transition-colors text-neutral-50"
                >
                  <FiChevronLeft />
                </button>
                <span className="text-sm font-semibold text-neutral-40 px-2 min-w-[120px] text-center">
                  {monthName}
                </span>
                <button
                  onClick={nextMonth}
                  className="p-1.5 hover:bg-neutral-105 rounded-md transition-colors text-neutral-50"
                >
                  <FiChevronRight />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ================= EMPTY STATE / LOADING ================= */}
        {!selectedEmployeeId ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-neutral-98 rounded-xl bg-neutral-105/30">
            <div className="w-16 h-16 rounded-full bg-white border border-neutral-98 flex items-center justify-center mb-4 shadow-sm">
              <FiUsers size={28} className="text-neutral-50" />
            </div>
            <h3 className="text-lg font-bold text-neutral-40">
              No Employee Selected
            </h3>
            <p className="text-sm text-neutral-65 mt-1 max-w-sm">
              Select an employee from the dropdown above to view their monthly
              timesheet.
            </p>
          </div>
        ) : isLoadingTimesheet ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader />
            <p className="text-sm text-neutral-65 mt-4">Loading timesheet...</p>
          </div>
        ) : (
          <>
            {/* ================= QUICK STATS ================= */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 rounded-xl border border-neutral-98 shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-10/10 flex items-center justify-center">
                  <FiTrendingUp className="text-primary-10" size={20} />
                </div>
                <div>
                  <p className="text-xs text-neutral-65 font-medium">
                    Total Hours
                  </p>
                  <p className="text-lg font-bold text-neutral-40">
                    {totalHoursLogged as any}h
                  </p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-neutral-98 shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <FiCheckCircle className="text-green-600" size={20} />
                </div>
                <div>
                  <p className="text-xs text-neutral-65 font-medium">
                    Days Logged
                  </p>
                  <p className="text-lg font-bold text-neutral-40">
                    {daysLogged}
                  </p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-neutral-98 shadow-sm flex items-center gap-3 col-span-2 md:col-span-1">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                  <FiClock className="text-orange-500" size={20} />
                </div>
                <div>
                  <p className="text-xs text-neutral-65 font-medium">
                    Avg Hours/Day
                  </p>
                  <p className="text-lg font-bold text-neutral-40">
                    {daysLogged > 0
                      ? ((totalHoursLogged as any) / daysLogged).toFixed(1)
                      : 0}
                    h
                  </p>
                </div>
              </div>
            </div>

            {/* ================= CALENDAR ================= */}
            <div className="bg-white p-6 rounded-xl border border-neutral-98">
              <div className="grid grid-cols-7 gap-2 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="text-center text-xs font-bold text-neutral-65 uppercase py-2"
                    >
                      {day}
                    </div>
                  ),
                )}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {/* Empty cells for start of month */}
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="h-24 bg-neutral-105/50 rounded-xl"
                  />
                ))}

                {/* Days */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const iterDate = new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth(),
                    dayNum,
                  );
                  const dateStr = `${iterDate.getFullYear()}-${String(iterDate.getMonth() + 1).padStart(2, "0")}-${String(iterDate.getDate()).padStart(2, "0")}`;

                  const isWeekend =
                    iterDate.getDay() === 0 || iterDate.getDay() === 6;
                  const hours = timesheetMap[dateStr] || 0;

                  // Admin view is strictly read-only
                  return (
                    <div
                      key={dayNum}
                      className={`relative h-24 p-2 rounded-xl border flex flex-col justify-between transition-all ${
                        isWeekend
                          ? "bg-neutral-105/50 border-transparent text-neutral-65"
                          : "bg-white border-neutral-98"
                      }`}
                    >
                      <span
                        className={`text-sm font-semibold ${isWeekend ? "text-neutral-50/60" : "text-neutral-40"}`}
                      >
                        {dayNum}
                      </span>

                      {!isWeekend && (
                        <div className="flex flex-col gap-1">
                          {hours > 0 ? (
                            <span
                              className={`text-xs font-bold px-2 py-0.5 rounded-md w-fit ${hours >= 8 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                            >
                              {hours}h logged
                            </span>
                          ) : (
                            <span className="text-xs font-medium text-red-400 flex items-center gap-1">
                              <FiAlertCircle size={12} /> Missing
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </DashboardContainer>
    </div>
  );
};

export default TeamTimesheet;
