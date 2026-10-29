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
} from "react-icons/fi";
import toast from "react-hot-toast";
import { formatDate } from "../../utils/formatDate";
import DashboardContainer from "../../components/Dashboard/SharedComponents/DashboardContainer/DashboardContainer";
import Button from "../../components/Reusable/Button/Button";

// --- Mock Data (Replace with API later) ---
const mockEmployee = {
  name: "Arjun Sharma",
  employmentType: "Full-time", // "Full-time" | "Consultant" | "Intern"
  role: "employee", // "hr" | "admin" | "employee"
};

// Mock data for logged hours (YYYY-MM-DD: hours)
const mockTimesheetData: Record<string, number> = {
  "2026-10-01": 8,
  "2026-10-02": 8,
  "2026-10-05": 8,
  "2026-10-06": 8,
  "2026-10-07": 8,
  "2026-10-08": 8,
  "2026-10-09": 6, // Missing 2 hours
  "2026-10-12": 8,
  "2026-10-13": 8,
  "2026-10-14": 8,
  "2026-10-15": 8,
  "2026-10-16": 8,
  "2026-10-19": 8,
  "2026-10-20": 8,
  "2026-10-21": 8,
  "2026-10-22": 8,
  "2026-10-23": 8,
  "2026-10-26": 8,
  "2026-10-27": 8,
  "2026-10-28": 0, // Today - not filled
};

const Timesheet = () => {
  const isHR = mockEmployee.role === "hr" || mockEmployee.role === "admin";
  const isRegularEmployee = mockEmployee.employmentType === "Full-time";

  // --- State ---
  const [activeTab, setActiveTab] = useState<"my-timesheet" | "team-summary">(
    isHR ? "team-summary" : "my-timesheet"
  );
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 9, 1)); // Oct 2026 for demo
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [logHours, setLogHours] = useState<number>(8);

  // --- Access Control ---
  if (!isRegularEmployee && !isHR) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <FiBriefcase className="text-neutral-65 mb-4" size={48} />
        <h2 className="text-xl font-bold text-neutral-40">Timesheet Not Available</h2>
        <p className="text-neutral-65 mt-2">
          Timesheets are only required for Regular Full-time employees. <br />
          As a {mockEmployee.employmentType}, you don't need to log hours.
        </p>
      </div>
    );
  }

  // --- Calendar Logic ---
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());
  const firstDay = getFirstDayOfMonth(currentMonth.getFullYear(), currentMonth.getMonth());

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const monthName = currentMonth.toLocaleString("default", { month: "long", year: "numeric" });

  // --- Handlers ---
  const handleDayClick = (dateStr: string) => {
    setSelectedDate(dateStr);
    const existingHours = mockTimesheetData[dateStr] || 0;
    setLogHours(existingHours === 0 ? 8 : existingHours);
  };

  const handleSaveHours = () => {
    if (!selectedDate) return;
    // API call would go here
    toast.success(`Logged ${logHours} hours for ${formatDate(selectedDate)}`);
    setSelectedDate(null);
  };

  // --- Weekly Summary Logic (Mock) ---
  const mockTeamSummary = [
    { name: "Arjun Sharma", email: "arjun@algoquad.in", mon: 8, tue: 8, wed: 8, thu: 8, fri: 6, total: 38 },
    { name: "Priya Menon", email: "priya@algoquad.in", mon: 8, tue: 8, wed: 8, thu: 8, fri: 8, total: 40 },
    { name: "Rahul Verma", email: "rahul@algoquad.in", mon: 8, tue: 8, wed: 8, thu: 8, fri: 8, total: 40 },
  ];

  return (
    <div className="font-Montserrat pb-10">
      {/* Tabs */}
      {isHR && (
        <div className="flex gap-4 mb-6 border-b border-neutral-98">
          <button
            onClick={() => setActiveTab("team-summary")}
            className={`pb-3 text-sm font-semibold transition-colors ${
              activeTab === "team-summary" ? "text-primary-10 border-b-2 border-primary-10" : "text-neutral-65 hover:text-neutral-40"
            }`}
          >
            <div className="flex items-center gap-2"><FiUsers /> Team Summary</div>
          </button>
          <button
            onClick={() => setActiveTab("my-timesheet")}
            className={`pb-3 text-sm font-semibold transition-colors ${
              activeTab === "my-timesheet" ? "text-primary-10 border-b-2 border-primary-10" : "text-neutral-65 hover:text-neutral-40"
            }`}
          >
            <div className="flex items-center gap-2"><FiClock /> My Timesheet</div>
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
              <h1 className="text-xl font-bold text-neutral-40">My Timesheet</h1>
              <p className="text-sm text-neutral-65">Log a mandatory 8 hours for each working day.</p>
            </div>
            <div className="flex items-center gap-2 bg-neutral-105 p-1 rounded-lg border border-neutral-98">
              <button onClick={prevMonth} className="p-1.5 hover:bg-white rounded-md transition-colors"><FiChevronLeft /></button>
              <span className="text-sm font-semibold text-neutral-40 px-2 min-w-[120px] text-center">{monthName}</span>
              <button onClick={nextMonth} className="p-1.5 hover:bg-white rounded-md transition-colors"><FiChevronRight /></button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-xs font-bold text-neutral-65 uppercase py-2">
                {day}
              </div>
            ))}

            {/* Empty cells for start of month */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="h-24 bg-neutral-105/50 rounded-xl" />
            ))}

            {/* Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
              const isWeekend = new Date(dateStr).getDay() === 0 || new Date(dateStr).getDay() === 6;
              const hours = mockTimesheetData[dateStr] || 0;
              const isMissing = !isWeekend && hours < 8;

              return (
                <div
                  key={dayNum}
                  onClick={() => !isWeekend && handleDayClick(dateStr)}
                  className={`relative h-24 p-2 rounded-xl border flex flex-col justify-between transition-all ${
                    isWeekend
                      ? "bg-neutral-105/50 border-transparent text-neutral-65 cursor-not-allowed"
                      : "bg-white border-neutral-98 hover:border-primary-10 cursor-pointer shadow-sm"
                  }`}
                >
                  <span className="text-sm font-semibold text-neutral-40">{dayNum}</span>
                  
                  {!isWeekend && (
                    <div className="flex flex-col gap-1">
                      {hours > 0 ? (
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-md w-fit ${hours === 8 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                          {hours}h logged
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
        </DashboardContainer>
      )}

      {/* ========================================================= */}
      {/* VIEW 2: TEAM SUMMARY (HR Only) */}
      {/* ========================================================= */}
      {activeTab === "team-summary" && isHR && (
        <DashboardContainer>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl font-bold text-neutral-40">Weekly Team Summary</h1>
              <p className="text-sm text-neutral-65">Review logged hours for all regular employees.</p>
            </div>
            <div className="flex items-center gap-2 bg-white border border-neutral-98 px-3 py-2 rounded-lg text-sm text-neutral-40">
              <FiCalendar className="text-primary-10" /> Week: Oct 26 - Oct 30, 2026
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-max">
              <thead>
                <tr className="bg-neutral-105 border-b border-neutral-98">
                  <th className="p-3 text-xs font-semibold text-neutral-60 uppercase">Employee</th>
                  <th className="p-3 text-xs font-semibold text-neutral-60 uppercase text-center">Mon</th>
                  <th className="p-3 text-xs font-semibold text-neutral-60 uppercase text-center">Tue</th>
                  <th className="p-3 text-xs font-semibold text-neutral-60 uppercase text-center">Wed</th>
                  <th className="p-3 text-xs font-semibold text-neutral-60 uppercase text-center">Thu</th>
                  <th className="p-3 text-xs font-semibold text-neutral-60 uppercase text-center">Fri</th>
                  <th className="p-3 text-xs font-semibold text-neutral-60 uppercase text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-98">
                {mockTeamSummary.map((emp, idx) => (
                  <tr key={idx} className="hover:bg-neutral-105/50">
                    <td className="p-3">
                      <p className="font-semibold text-neutral-40">{emp.name}</p>
                      <p className="text-xs text-neutral-65">{emp.email}</p>
                    </td>
                    {[emp.mon, emp.tue, emp.wed, emp.thu, emp.fri].map((h, i) => (
                      <td key={i} className="p-3 text-center">
                        <span className={`inline-block px-2 py-1 rounded-md text-sm font-medium ${h === 8 ? "text-green-600 bg-green-50" : "text-yellow-600 bg-yellow-50"}`}>
                          {h}h
                        </span>
                      </td>
                    ))}
                    <td className="p-3 text-right">
                      <span className={`font-bold ${emp.total >= 40 ? "text-green-600" : "text-red-500"}`}>
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
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 font-Montserrat">
            <h2 className="text-lg font-bold text-neutral-40 mb-1">Log Hours</h2>
            <p className="text-sm text-neutral-65 mb-6">Date: {formatDate(selectedDate)}</p>

            <label className="block text-sm font-medium text-neutral-40 mb-2">Hours Worked</label>
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
              <span className="text-2xl font-bold text-primary-10 w-10 text-right">{logHours}</span>
            </div>

            {logHours < 8 ? (
              <p className="text-xs text-red-500 mb-4 flex items-center gap-1">
                <FiAlertCircle /> You must log at least 8 hours for a working day.
              </p>
            ) : (
              <p className="text-xs text-green-600 mb-4 flex items-center gap-1">
                <FiCheckCircle /> 8-hour requirement met.
              </p>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedDate(null)}
                className="px-4 py-2 rounded-lg border border-neutral-30 text-sm"
              >
                Cancel
              </button>
              <Button
                variant="primary"
                label="Save Hours"
                onClick={handleSaveHours}
                classNames="py-2 px-4"
                disabled={logHours < 8}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timesheet;