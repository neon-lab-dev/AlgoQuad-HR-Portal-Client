/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiCalendar,
  FiUsers,
  FiBriefcase,
  FiX,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { formatDate } from "../../utils/formatDate";
import DashboardContainer from "../../components/Dashboard/SharedComponents/DashboardContainer/DashboardContainer";
import Button from "../../components/Reusable/Button/Button";
import {
  useAddWorkingHourMutation,
  useGetMyTimesheetQuery,
} from "../../redux/Features/Timesheet/timesheetApi";

// --- Mock Data ---
const mockEmployee = {
  name: "Arjun Sharma",
  employmentType: "Full-time",
  role: "employee",
};

const MyTimesheet = () => {
  const isHR = mockEmployee.role === "hr" || mockEmployee.role === "admin";
  const isRegularEmployee = mockEmployee.employmentType === "Full-time";

  // --- State ---
  const [activeTab, setActiveTab] = useState<"my-timesheet" | "team-summary">(
    isHR ? "team-summary" : "my-timesheet",
  );
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [logHours, setLogHours] = useState<number>(8);

  // --- API Hooks ---
  const { data, isLoading, refetch } = useGetMyTimesheetQuery({
    month: currentMonth.getMonth() + 1,
    year: currentMonth.getFullYear(),
  });

  const [addWorkingHour, { isLoading: isAdding }] = useAddWorkingHourMutation();

  const myTimesheet = data?.data || [];
  console.log(myTimesheet);

  // Convert API array into a quick lookup map: { "2026-10-29": 8 }
  const timesheetMap = myTimesheet.reduce((acc: any, curr: any) => {
    // Extract YYYY-MM-DD safely avoiding timezone shifts
    const dateStr = new Date(curr.date).toISOString().split("T")[0];
    acc[dateStr] = curr.hours;
    return acc;
  }, {});

  // --- Access Control ---
  if (!isRegularEmployee && !isHR) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <FiBriefcase className="text-neutral-65 mb-4" size={48} />
        <h2 className="text-xl font-bold text-neutral-40">
          Timesheet Not Available
        </h2>
        <p className="text-neutral-65 mt-2">
          Timesheets are only required for Regular Full-time employees. <br />
          As a {mockEmployee.employmentType}, you don't need to log hours.
        </p>
      </div>
    );
  }

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

  // --- Handlers ---
  const handleDayClick = (dateStr: string, isPast: boolean) => {
    if (isPast) {
      toast.error("You cannot edit past timesheet entries.");
      return;
    }
    setSelectedDate(dateStr);
    const existingHours = timesheetMap[dateStr] || 0;
    setLogHours(existingHours === 0 ? 8 : existingHours);
  };

  const handleSaveHours = async () => {
    if (!selectedDate) return;

    try {
      await addWorkingHour({
        date: selectedDate,
        hours: logHours,
      }).unwrap();
      setSelectedDate(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to log hours");
    }
  };

  // --- Weekly Summary Logic (Mock) ---
  const mockTeamSummary = [
    {
      name: "Arjun Sharma",
      email: "arjun@algoquad.in",
      mon: 8,
      tue: 8,
      wed: 8,
      thu: 8,
      fri: 6,
      total: 38,
    },
    {
      name: "Priya Menon",
      email: "priya@algoquad.in",
      mon: 8,
      tue: 8,
      wed: 8,
      thu: 8,
      fri: 8,
      total: 40,
    },
    {
      name: "Rahul Verma",
      email: "rahul@algoquad.in",
      mon: 8,
      tue: 8,
      wed: 8,
      thu: 8,
      fri: 8,
      total: 40,
    },
  ];

  return (
    <div className="font-Montserrat pb-10">
      {/* Tabs */}
      {isHR && (
        <div className="flex gap-4 mb-6 border-b border-neutral-98">
          <button
            onClick={() => setActiveTab("team-summary")}
            className={`pb-3 text-sm font-semibold transition-colors ${
              activeTab === "team-summary"
                ? "text-primary-10 border-b-2 border-primary-10"
                : "text-neutral-65 hover:text-neutral-40"
            }`}
          >
            <div className="flex items-center gap-2">
              <FiUsers /> Team Summary
            </div>
          </button>
          <button
            onClick={() => setActiveTab("my-timesheet")}
            className={`pb-3 text-sm font-semibold transition-colors ${
              activeTab === "my-timesheet"
                ? "text-primary-10 border-b-2 border-primary-10"
                : "text-neutral-65 hover:text-neutral-40"
            }`}
          >
            <div className="flex items-center gap-2">
              <FiClock /> My Timesheet
            </div>
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW 1: MY TIMESHEET (Calendar) */}
      {/* ========================================================= */}
      {activeTab === "my-timesheet" && (
        <DashboardContainer>
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold text-neutral-40">
                My Timesheet
              </h1>
              <p className="text-sm text-neutral-65">
                Log a mandatory 8 hours for each working day.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-neutral-105 p-1 rounded-lg border border-neutral-98">
              <button
                onClick={prevMonth}
                className="p-1.5 hover:bg-white rounded-md transition-colors"
              >
                <FiChevronLeft />
              </button>
              <span className="text-sm font-semibold text-neutral-40 px-2 min-w-[120px] text-center">
                {monthName}
              </span>
              <button
                onClick={nextMonth}
                className="p-1.5 hover:bg-white rounded-md transition-colors"
              >
                <FiChevronRight />
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20 text-neutral-65">
              Loading timesheet...
            </div>
          ) : (
            /* Calendar Grid */
            <div className="grid grid-cols-7 gap-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-bold text-neutral-65 uppercase py-2"
                >
                  {day}
                </div>
              ))}

              {/* Empty cells for start of month */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="h-24 bg-neutral-105/50 rounded-xl"
                />
              ))}

              {/* Days */}
              {/* Days */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;

                // Build the local date string
                const iterDate = new Date(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth(),
                  dayNum,
                );
                const dateStr = `${iterDate.getFullYear()}-${String(iterDate.getMonth() + 1).padStart(2, "0")}-${String(iterDate.getDate()).padStart(2, "0")}`;

                const isWeekend =
                  iterDate.getDay() === 0 || iterDate.getDay() === 6;

                // --- Date Comparison Logic ---
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Normalize to midnight

                const isPast = iterDate < today;
                const isFuture = iterDate > today;
                const isToday = iterDate.getTime() === today.getTime();

                // Disable if past OR future (only TODAY is clickable)
                const isDisabled = isWeekend || isPast || isFuture;

                const hours = timesheetMap[dateStr] || 0;

                return (
                  <div
                    key={dayNum}
                    onClick={() => {
                      if (isWeekend) return;
                      if (isPast) {
                        return;
                      }
                      if (isFuture) {
                        return;
                      }
                      handleDayClick(dateStr, isPast); // Only runs for today
                    }}
                    className={`relative h-24 p-2 rounded-xl border flex flex-col justify-between transition-all ${
                      isWeekend
                        ? "bg-neutral-105/50 border-transparent text-neutral-65 cursor-not-allowed"
                        : isDisabled
                          ? "bg-neutral-100 border-neutral-98 opacity-70 cursor-not-allowed"
                          : "bg-white border-primary-10 shadow-md cursor-pointer ring-2 ring-primary-10/20" // Highlight Today
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-sm font-semibold ${isDisabled ? "text-neutral-60" : "text-primary-10"}`}
                      >
                        {dayNum}
                      </span>
                      {isToday && !isWeekend && (
                        <span className="text-[9px] font-bold text-primary-10 bg-primary-10/10 px-1.5 py-0.5 rounded uppercase">
                          Today
                        </span>
                      )}
                    </div>

                    {!isWeekend && (
                      <div className="flex flex-col gap-1">
                        {hours > 0 ? (
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-md w-fit ${hours === 8 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                          >
                            {hours}h logged
                          </span>
                        ) : isPast ? (
                          <span className="text-xs font-medium text-neutral-60 flex items-center gap-1">
                            Missed
                          </span>
                        ) : isFuture ? (
                          <span className="text-xs font-medium text-neutral-60 flex items-center gap-1">
                            Upcoming
                          </span>
                        ) : (
                          <span className="text-xs font-medium text-red-500 flex items-center gap-1">
                            <FiAlertCircle /> Missing
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </DashboardContainer>
      )}

      {/* ========================================================= */}
      {/* VIEW 2: TEAM SUMMARY (HR Only) */}
      {/* ========================================================= */}
      {activeTab === "team-summary" && isHR && (
        <DashboardContainer>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl font-bold text-neutral-40">
                Weekly Team Summary
              </h1>
              <p className="text-sm text-neutral-65">
                Review logged hours for all regular employees.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white border border-neutral-98 px-3 py-2 rounded-lg text-sm text-neutral-40">
              <FiCalendar className="text-primary-10" /> Week: Oct 26 - Oct 30,
              2026
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-max">
              <thead>
                <tr className="bg-neutral-105 border-b border-neutral-98">
                  <th className="p-3 text-xs font-semibold text-neutral-60 uppercase">
                    Employee
                  </th>
                  <th className="p-3 text-xs font-semibold text-neutral-60 uppercase text-center">
                    Mon
                  </th>
                  <th className="p-3 text-xs font-semibold text-neutral-60 uppercase text-center">
                    Tue
                  </th>
                  <th className="p-3 text-xs font-semibold text-neutral-60 uppercase text-center">
                    Wed
                  </th>
                  <th className="p-3 text-xs font-semibold text-neutral-60 uppercase text-center">
                    Thu
                  </th>
                  <th className="p-3 text-xs font-semibold text-neutral-60 uppercase text-center">
                    Fri
                  </th>
                  <th className="p-3 text-xs font-semibold text-neutral-60 uppercase text-right">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-98">
                {mockTeamSummary.map((emp, idx) => (
                  <tr key={idx} className="hover:bg-neutral-105/50">
                    <td className="p-3">
                      <p className="font-semibold text-neutral-40">
                        {emp.name}
                      </p>
                      <p className="text-xs text-neutral-65">{emp.email}</p>
                    </td>
                    {[emp.mon, emp.tue, emp.wed, emp.thu, emp.fri].map(
                      (h, i) => (
                        <td key={i} className="p-3 text-center">
                          <span
                            className={`inline-block px-2 py-1 rounded-md text-sm font-medium ${h === 8 ? "text-green-600 bg-green-50" : "text-yellow-600 bg-yellow-50"}`}
                          >
                            {h}h
                          </span>
                        </td>
                      ),
                    )}
                    <td className="p-3 text-right">
                      <span
                        className={`font-bold ${emp.total >= 40 ? "text-green-600" : "text-red-500"}`}
                      >
                        {emp.total}h
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardContainer>
      )}

      {/* ========================================================= */}
      {/* LOG HOURS MODAL */}
      {/* ========================================================= */}
      {selectedDate && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 font-Montserrat shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold text-neutral-40">Log Hours</h2>
                <p className="text-sm text-neutral-65">
                  Date: {formatDate(selectedDate)}
                </p>
              </div>
              <button
                onClick={() => setSelectedDate(null)}
                className="text-neutral-50 hover:text-red-500"
              >
                <FiX size={20} />
              </button>
            </div>

            <label className="block text-sm font-medium text-neutral-40 mb-2">
              Hours Worked
            </label>
            <div className="flex items-center gap-4 mb-6">
              <input
                type="range"
                min={0}
                max={12}
                step={1}
                value={logHours}
                onChange={(e) => setLogHours(Number(e.target.value))}
                className="flex-1 accent-primary-10"
              />
              <span className="text-2xl font-bold text-primary-10 w-10 text-right">
                {logHours}
              </span>
            </div>

            {logHours === 8 && (
              <p className="text-xs text-green-600 mb-4 flex items-center gap-1">
                <FiCheckCircle /> 8-hour requirement met.
              </p>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-98">
              <button
                onClick={() => setSelectedDate(null)}
                className="px-4 py-2 rounded-lg border border-neutral-30 text-sm hover:bg-neutral-105 transition-colors"
              >
                Cancel
              </button>
              <Button
                variant="primary"
                label="Save Hours"
                onClick={handleSaveHours}
                classNames="py-2 px-4"
                isLoading={isAdding}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTimesheet;
