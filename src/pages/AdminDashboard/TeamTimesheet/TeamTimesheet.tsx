/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiUsers,
  FiTrendingUp,
  FiDownload,
} from "react-icons/fi";
import DashboardContainer from "../../../components/Dashboard/SharedComponents/DashboardContainer/DashboardContainer";
import Loader from "../../../components/Shared/Loader/Loader";
import { useGetAllEmployeesQuery } from "../../../redux/Features/Employee/employeeApi";
import { useGetTimesheetOfAnEmployeeQuery } from "../../../redux/Features/Timesheet/timesheetApi";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
import { ICONS } from "../../../assets";

const TeamTimesheet = () => {
  // --- State ---
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Ref for the area to capture in PDF
  const printRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // --- Queries ---
  const { data: employeesData, isLoading: isLoadingEmployees } =
    useGetAllEmployeesQuery({
      limit: 1000,
    });
  const employees = employeesData?.data || [];

  const { data: timesheetData, isLoading: isLoadingTimesheet } =
    useGetTimesheetOfAnEmployeeQuery(
      {
        id: selectedEmployeeId,
        month: currentMonth.getMonth() + 1,
        year: currentMonth.getFullYear(),
      },
      { skip: !selectedEmployeeId },
    );

  const timesheet = timesheetData?.data || [];
  const selectedEmployee = employees.find(
    (emp: any) => emp._id === selectedEmployeeId,
  );

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

  // --- PDF Download Handler ---
  const handleDownloadPdf = async () => {
    if (!printRef.current || !selectedEmployee) return;
    setIsDownloading(true);
    const toastId = toast.loading("Generating PDF...");

    try {
      const element = printRef.current;

      // 1. Capture the DOM element as a canvas
      const canvas = await html2canvas(element, {
        scale: 2, // Higher resolution
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");

      // 2. Initialize PDF (A4 size, portrait)
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // 3. Add Image to PDF
      pdf.addImage(imgData, "PNG", 0, 10, pdfWidth, pdfHeight);

      // 4. Save the file
      const fileName = `${selectedEmployee.userId?.name.replace(/\s+/g, "_")}_Timesheet_${monthName.replace(/\s+/g, "_")}.pdf`;
      pdf.save(fileName);

      toast.success("PDF downloaded successfully!", { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF.", { id: toastId });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="font-Montserrat pb-10">
      <DashboardContainer>
        {/* ================= HEADER & EMPLOYEE SELECTOR ================= */}
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
                  <option key={emp._id} value={emp._id}>
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

            {/* Download Button (Only shows when an employee is selected) */}
            {selectedEmployeeId && (
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-neutral-65 uppercase tracking-wide opacity-0 select-none hidden lg:block">
                  Action
                </label>
                <button
                  onClick={handleDownloadPdf}
                  disabled={isDownloading || isLoadingTimesheet}
                  className="flex items-center gap-2 bg-primary-10 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-10/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed h-[38px]"
                >
                  {isDownloading ? "Generating..." : "Download PDF"}
                  <FiDownload />
                </button>
              </div>
            )}
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
          /* --- WRAPPER FOR PDF CAPTURE --- */
          <div ref={printRef} className="bg-white p-8 rounded-xl">
            {/* --- COMPANY LOGO --- */}
            <div className="flex justify-center mb-8">
              <img
                src={ICONS.logo}
                alt="AlgoQuad"
                className="w-70 object-contain"
                // Note: For best PDF results, use a height (h-12) instead of width (w-50)
                // so the aspect ratio stays perfect.
              />
            </div>

            {/* --- DOCUMENT HEADER --- */}
            <div className="mb-8 flex justify-between items-end border-b-2 border-neutral-98 pb-6">
              <div>
                <h2 className="text-3xl font-bold text-neutral-40 tracking-tight">
                  Employee Timesheet
                </h2>
                <p className="text-sm font-medium text-primary-10 mt-1">
                  Month: {monthName}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-neutral-40">
                  {selectedEmployee?.userId?.name}
                </p>
                <p className="text-lg font-semibold text-neutral-60 mt-0.5">
                  ID: {selectedEmployee?.employeeId}
                </p>
                <p className=" text-neutral-65 mt-0.5">
                  {selectedEmployee?.designation} ·{" "}
                  {selectedEmployee?.department}
                </p>
              </div>
            </div>

            {/* --- QUICK STATS --- */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-neutral-105 p-4 rounded-xl border border-neutral-98 flex flex-col items-center justify-center text-center">
                <FiTrendingUp className="text-primary-10 mb-2" size={24} />
                <p className="text-xs text-neutral-65 font-medium uppercase tracking-wide">
                  Total Hours
                </p>
                <p className="text-2xl font-bold text-neutral-40 mt-1">
                  {totalHoursLogged as any}h
                </p>
              </div>
              <div className="bg-neutral-105 p-4 rounded-xl border border-neutral-98 flex flex-col items-center justify-center text-center">
                <FiCheckCircle className="text-green-600 mb-2" size={24} />
                <p className="text-xs text-neutral-65 font-medium uppercase tracking-wide">
                  Days Logged
                </p>
                <p className="text-2xl font-bold text-neutral-40 mt-1">
                  {daysLogged}
                </p>
              </div>
              <div className="bg-neutral-105 p-4 rounded-xl border border-neutral-98 flex flex-col items-center justify-center text-center">
                <FiClock className="text-orange-500 mb-2" size={24} />
                <p className="text-xs text-neutral-65 font-medium uppercase tracking-wide">
                  Avg Hours/Day
                </p>
                <p className="text-2xl font-bold text-neutral-40 mt-1">
                  {daysLogged > 0
                    ? ((totalHoursLogged as any) / daysLogged).toFixed(1)
                    : 0}
                  h
                </p>
              </div>
            </div>

            {/* --- CALENDAR --- */}
            <div className="bg-white border border-neutral-98 rounded-2xl p-4">
              <div className="grid grid-cols-7 gap-2 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="text-center text-[11px] font-bold text-neutral-60 uppercase tracking-widest py-2 border-b border-neutral-98"
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
                    className="h-24 bg-neutral-105/30 rounded-xl border border-transparent"
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
                  const hours = timesheetMap[dateStr] || 0;

                  return (
                    <div
                      key={dayNum}
                      className="relative h-24 p-2.5 rounded-xl border flex flex-col justify-between bg-white border-neutral-98"
                    >
                      <span className="text-sm font-bold text-neutral-40">
                        {dayNum}
                      </span>

                      <div className="flex flex-col gap-1">
                        {hours > 0 ? (
                          <span
                            className={`text-[11px] font-bold px-2 py-1 rounded-md w-fit ${
                              hours >= 8
                                ? "bg-green-100 text-green-700 border border-green-200"
                                : "bg-yellow-100 text-yellow-700 border border-yellow-200"
                            }`}
                          >
                            {hours}h logged
                          </span>
                        ) : (
                          <span className="text-[11px] font-semibold text-red-500 flex items-center gap-1 bg-red-50 px-2 py-1 rounded-md w-fit border border-red-100">
                            <FiAlertCircle size={12} /> Missing
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* --- FOOTER --- */}
            <div className="mt-8 pt-6 border-t border-neutral-98 flex justify-between items-center text-[10px] text-neutral-65">
              <p>Generated by AlgoQuad HR Portal</p>
              <p>
                Generated on {new Date().toLocaleDateString()} at{" "}
                {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
        )}
      </DashboardContainer>
    </div>
  );
};

export default TeamTimesheet;
