/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isEqual,
  isPast,
  isSameDay,
  isSameMonth,
  isSunday,
  isToday,
  parse,
  parseISO,
  startOfToday,
} from "date-fns";
import { startOfWeek } from "date-fns/fp";
import { useCallback, useEffect, useMemo, useState } from "react";
import TimePicker from "./TimePicker";
import { useGetAllAvailabilityQuery } from "../../../redux/Features/Availability/availabilityApi";

type CalenderProps = {
  onBookingChange: (value: string) => void;
};

function classNames(...classes: (string | boolean)[]) {

  return classes.filter(Boolean).join(" ");
}

export default function Calender({ onBookingChange }: CalenderProps) {
  const { data } = useGetAllAvailabilityQuery({});
  const availabilities = data?.data?.availabilities || [];
  const today = startOfToday();
  const [selectedDay, setSelectedDay] = useState(today);
  const [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
  const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());
  const [bookingDate, setBookingDate] = useState<string | null>(null);
  const [hoverInfo, setHoverInfo] = useState<{
    date: Date | null;
    status: string | null;
  }>({
    date: null,
    status: null,
  });

  const days = useMemo(
    () =>
      eachDayOfInterval({
        start: startOfWeek(firstDayCurrentMonth),
        end: endOfWeek(endOfMonth(firstDayCurrentMonth)),
      }),
    [firstDayCurrentMonth]
  );

  function previousMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  function nextMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }
  const handleTimeChange = useCallback(
    (value: string) => {
      // Check if the selected day is valid
      const isUnavailable =
        (isPast(selectedDay) && !isToday(selectedDay)) ||
        availabilities.some(
          (availability: any) =>
            isSameDay(parseISO(availability.date), selectedDay) &&
            availability.isBooked
        ) || !availabilities.some(
          (availability: any) =>
            isSameDay(parseISO(availability.date), selectedDay) 
        ) ||
        !isSameMonth(selectedDay, firstDayCurrentMonth) ||
        isSunday(selectedDay);

      if (isUnavailable) {
        // ❌ send empty if not available
        setBookingDate(null);
        onBookingChange("");
      } else {
        // ✅ send the actual booking slot
        setBookingDate(value);
        onBookingChange(value);
      }
    },
    [selectedDay, availabilities, firstDayCurrentMonth, onBookingChange]
  );

  useEffect(() => {
    console.log(bookingDate);
  }, [bookingDate]);

  const hoverDateDetail = (day: Date) => {
    if (
      isSunday(day) ||
      (isPast(day) && !isToday(day)) ||
      (availabilities.some(
        (availabilities: any) =>
          isSameDay(parseISO(availabilities.date), day) &&
          availabilities.isBooked
      ) &&
        isSameMonth(day, firstDayCurrentMonth)) || (!availabilities.some(
        (availabilities: any) =>
          isSameDay(parseISO(availabilities.date), day)
      ) &&
        isSameMonth(day, firstDayCurrentMonth))
    ) {
      setHoverInfo({ date: day, status: "Slot not Available" });
    } else {
      setHoverInfo({ date: day, status: "Slot Available" });
    }
  };

  // const selectedDayMeetings = meetings.filter((meeting) =>
  //   isSameDay(parseISO(meeting.date), selectedDay)
  // );

  return (
    <div className="bg-surface-75 font-Montserrat p-6 rounded-tl-[20px] rounded-tr-[20px] rounded-t-[20px] lg:rounded-tr-none lg:rounded-t-none lg:rounded-l-[20px] w-full lg:w-[40%]">
      <h1 className="text-xl font-bold text-neutral-30 text-center">
        Select a Slot
      </h1>
      <div className="max-w-md p-5 mx-auto md:max-w-4xl bg-white border border-neutral-120 rounded-xl shadow-2xl mt-6">
        <div className="flex w-full justify-between items-center">
          <button
            type="button"
            onClick={previousMonth}
            className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-neutral-115 hover:text-gray-500"
          >
            <span className="sr-only">Previous month</span>
            <ChevronLeftIcon className="w-6 h-6" aria-hidden="true" />
          </button>
          <h2 className=" text-center text-lg text-neutral-20 font-semibold ">
            {format(firstDayCurrentMonth, "MMMM yyyy")}
          </h2>
          <button
            onClick={nextMonth}
            type="button"
            className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-neutral-115 hover:text-gray-500"
          >
            <span className="sr-only">Next month</span>
            <ChevronRightIcon className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>
        <div className="grid grid-cols-7 mt-10 font-semibold tracking-[-0.16] leading-6 text-center text-gray-500 text-base ">
          <div>Su</div>
          <div>Mo</div>
          <div>Tu</div>
          <div>We</div>
          <div>Th</div>
          <div>Fr</div>
          <div>Sa</div>
        </div>
        <div className="grid grid-cols-7 mt-2 text-sm">
          {days.map((day, dayIdx) => (
            <div
              key={day.toString()}
              className={classNames(
                dayIdx === 0 && colStartClasses[getDay(day)],
                "py-1.5"
              )}
            >
              <button
                onMouseEnter={() => {
                  hoverDateDetail(day);
                }}
                onMouseLeave={() => setHoverInfo({ date: null, status: null })}
                type="button"
                onClick={() => setSelectedDay(day)}
                className={classNames(
                  isEqual(day, selectedDay) && "text-white",
                  !isEqual(day, selectedDay) &&
                    isToday(day) &&
                    availabilities.some((availabilities: any) =>
                      isSameDay(parseISO(availabilities.date), day) && availabilities.isBooked
                    ) &&
                    "text-primary-15",
                  !isEqual(day, selectedDay) &&
                    isToday(day) &&
                    availabilities.some((availabilities: any) =>
                      isSameDay(parseISO(availabilities.date), day) && !availabilities.isBooked
                    ) &&
                    "text-success-20",
                  ((!isEqual(day, selectedDay) &&
                    !isToday(day) &&
                    isSameMonth(day, firstDayCurrentMonth) &&
                    isPast(day)) ||
                    (isSunday(day) &&
                      isSameMonth(day, firstDayCurrentMonth))) &&
                    "text-neutral-125 hover:border border-neutral-125 transition duration-300 ease-in",
                  !isEqual(day, selectedDay) &&
                    !isToday(day) &&
                    !isSameMonth(day, firstDayCurrentMonth) &&
                    "text-neutral-98",
                  // isEqual(day, selectedDay) && isToday(day) && 'bg-red-500',
                  isEqual(day, selectedDay) &&
                    (isToday(day) || !isToday(day)) &&
                    "bg-secondary-10",

                  (!isEqual(day, selectedDay) || isEqual(day, selectedDay)) &&
                    (isToday(day) || !isToday(day)) &&
                    isSameMonth(day, firstDayCurrentMonth) &&
                    availabilities.some((availabilities: any) =>
                      isSameDay(parseISO(availabilities.date), day)&& !availabilities.isBooked
                    ) &&
                    "text-primary-15 hover:border border-primary-15 transition duration-300 ease-in",
                    isSameMonth(day, firstDayCurrentMonth) && ! availabilities.some((availabilities: any) =>
                      isSameDay(parseISO(availabilities.date), day)
                    )&& "text-neutral-125"
                    ,
                  (!isEqual(day, selectedDay) || isEqual(day, selectedDay)) &&
                    (isToday(day) || !isToday(day)) &&
                    isSameMonth(day, firstDayCurrentMonth) &&
                    availabilities.some((availabilities: any) =>
                      isSameDay(parseISO(availabilities.date), day) && !availabilities.isBooked
                    ) &&
                    !isSunday(day) &&
                    !isPast(day) &&
                    "text-success-20 hover:border border-success-20 transition duration-300 ease-in",
                  (isEqual(day, selectedDay) || isToday(day)) &&
                    "font-semibold",
                  "mx-auto relative flex text-sm font-medium h-8 w-8 items-center justify-center rounded-full"
                )}
              >
                <time dateTime={format(day, "yyyy-MM-dd")}>
                  {format(day, "d")}
                </time>
                {hoverInfo.date && isSameDay(hoverInfo.date, day) && (
                  <p className="opacity-100 z-[100] translate-y-0 absolute top-[-50px] transform translate-x-[-50%] font-medium left-[50%] w-max py-[7px] px-[20px] rounded-sm bg-neutral-110 text-[13px] dark:text-[#abc2d3] text-neutral-135  transition-all duration-200">
                    {hoverInfo.status}
                    {/* arrow */}
                    <span className="w-[8px] h-[8px] bg-gray-800 rotate-[45deg] absolute left-[50%] transform translate-x-[-50%] bottom-[-10%]"></span>
                  </p>
                )}
              </button>
            </div>
          ))}
        </div>

        <div
          className={`${
            (isPast(selectedDay) && !isToday(selectedDay)) ||
            availabilities.some((availabilities: any) =>
              isSameDay(parseISO(availabilities.date), selectedDay) && availabilities.isBooked
            ) || !availabilities.some((availabilities: any) =>
              isSameDay(parseISO(availabilities.date), selectedDay) )||
            !isSameMonth(selectedDay, firstDayCurrentMonth) ||
            isSunday(selectedDay)
              ? "hidden"
              : "block"
          } `}
        >
          <h2 className="mt-12 text-gray-900 mb-5">
            Choose slot time (only 30min)
          </h2>
          <TimePicker
            selectedDay={selectedDay}
            onChange={handleTimeChange}
            disabled={true}
          />
          <div></div>
        </div>
        {/* <section className="mt-12 md:mt-0 md:pl-14">
          <h2 className="font-semibold text-gray-900">
            Schedule for{" "}
            <time dateTime={format(selectedDay, "yyyy-MM-dd")}>
              {format(selectedDay, "MMM dd, yyy")}
            </time>
          </h2>
        </section> */}
      </div>
      <div className="text-center text-neutral-60 mt-6 text-[13px] font-medium leading-[16px] tracking-[-0.14px] space-y-2">
        <p>1.Only 6 slots/week are available</p>
        <p>2.30min / slot can be booked</p>
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
