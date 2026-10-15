import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isPast,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  startOfToday,
  startOfWeek,
  isWithinInterval,
} from "date-fns";
import { useState } from "react";
import Button from "../Button/Button";
type DateRange = {
  start: Date | null;
  end: Date | null;
};

interface TwoMonthsCalendarProps {
  value?: DateRange; // optional controlled value
  onChange?: (range: DateRange) => void; // callback to parent
  onClickApply:()=>void
}
function classNames(...classes: (string | boolean | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function TwoMonthsCalendar({ value, onChange,onClickApply }: TwoMonthsCalendarProps) {
  const today = startOfToday();
  const [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
  const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());
  const nextMonthDate = add(firstDayCurrentMonth, { months: 1 });

  // Range selection states
 const [rangeStart, setRangeStart] = useState<Date | null>(value?.start ?? null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(value?.end ?? null);

  function previousMonth() {
    const firstDayPrevMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayPrevMonth, "MMM-yyyy"));
  }

  function nextMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }
  
 function updateRange(start: Date | null, end: Date | null) {
    setRangeStart(start);
    setRangeEnd(end);
    onChange?.({ start, end }); // 🔑 pass to parent
  }

  function handleSelect(day: Date) {
    if (!rangeStart || (rangeStart && rangeEnd)) {
      // start new selection
      updateRange(day, null);
    } else if (rangeStart && !rangeEnd) {
      // finish range
      if (isPast(day) && !isToday(day)) return;
      const newStart = day < rangeStart ? day : rangeStart;
      const newEnd = day < rangeStart ? rangeStart : day;
      updateRange(newStart, newEnd);
    }
  }

  const renderMonth = (monthStart: Date) => {
    const days = eachDayOfInterval({
      start: startOfWeek(monthStart),
      end: endOfWeek(endOfMonth(monthStart)),
    });

    return (
      <div className="w-[280px]">
        <h2 className="text-center text-lg text-neutral-20 font-semibold">
          {format(monthStart, "MMMM yyyy")}
        </h2>
        <div className="grid grid-cols-7 mt-6 font-semibold text-center text-gray-500 text-base">
          <div>Su</div>
          <div>Mo</div>
          <div>Tu</div>
          <div>We</div>
          <div>Th</div>
          <div>Fr</div>
          <div>Sa</div>
        </div>
        <div className="grid grid-cols-7 mt-2 text-sm  ">
          {days.map((day, dayIdx) => {
            const isSelectedStart = rangeStart && isSameDay(day, rangeStart);
            const isSelectedEnd = rangeEnd && isSameDay(day, rangeEnd);
            const isCurrentMonth = isSameMonth(day, monthStart);

            const inRange =
              rangeStart &&
              rangeEnd &&
              isWithinInterval(day, { start: rangeStart, end: rangeEnd }) &&
              isCurrentMonth; // ✅ restrict red highlight to this month only
            const isRowStart = inRange && dayIdx % 7 === 0; // Sunday
            const isRowEnd = inRange && dayIdx % 7 === 6;
            return (
              <div
                key={day.toString()}
                className={classNames(
                  dayIdx === 0 && colStartClasses[getDay(day)],
                  "py-[1px]"
                )}
              >
                <div
                  className={classNames(
                    inRange && "bg-surface-60",
                    (isSelectedStart || isRowStart) && "rounded-l-full",
                    (isSelectedEnd || isRowEnd) && "rounded-r-full"
                  )}
                >
                  <button
                    onClick={() => handleSelect(day)}
                    type="button"
                    className={classNames(
                      (isSelectedStart || isSelectedEnd) &&
                        "text-white bg-secondary-10",
                      isSelectedStart && "rounded-full",
                      inRange && " text-black",
                      !isCurrentMonth && "text-neutral-98",
                      (isPast(day) && !isToday(day) && isCurrentMonth) 
                        ? "text-neutral-125"
                        : "",
                      "mx-0 relative flex text-sm font-medium h-10 w-10 items-center justify-center rounded-full"
                    )}
                  >
                    <time dateTime={format(day, "yyyy-MM-dd")}>
                      {format(day, "d")}
                    </time>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex justify-start font-Montserrat rounded-2xl w-fit">
      <div className="max-w-full">
        <div className="w-full p-5 mx-auto bg-white border border-neutral-120 rounded-xl shadow-2xl mt-6">
          <div className="flex justify-between items-center mb-6">
            <button onClick={previousMonth}>
              <ChevronLeftIcon className="w-6 h-6 text-neutral-115" />
            </button>
            <button onClick={nextMonth}>
              <ChevronRightIcon className="w-6 h-6 text-neutral-115" />
            </button>
          </div>

          {/* 2 months side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {renderMonth(firstDayCurrentMonth)}
            {renderMonth(nextMonthDate)}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end w-full gap-8 p-5">
            <div className="text-neutral-85">
              {rangeStart
                ? `${format(rangeStart, "dd/MM/yyyy")}`
                : "dd/mm/yyyy "}{" "}
              - {rangeEnd ? `${format(rangeEnd, "dd/MM/yyyy")}` : " dd/mm/yyyy"}
            </div>
            <div className="flex gap-[10px]">
              <Button
                variant="custom"
                label="Cancel"
                disabled={false}
                classNames="py-2 border-[1px] font-medium px-4 border-surface-90 text-neutral-10 bg-surface-30"
                onClick={() => {
                  setRangeStart(null);
                  setRangeEnd(null);
                }}
              />
              <Button
                variant="primary"
                label="Apply"
                classNames="px-3 font-medium py-[10px]"
                onClick={onClickApply}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
];
