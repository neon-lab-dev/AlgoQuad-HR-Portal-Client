import React, { useState, useEffect } from "react";

type TimePickerProps = {
  selectedDay: Date;
  onChange: (value: string) => void; // bookingDate in ISO format
  disabled?: boolean;
};

const TimePicker = ({ selectedDay, onChange }: TimePickerProps) => {
  const [hour] = useState(7);
  const [minute] = useState("00");
  const [period] = useState("PM");

  useEffect(() => {
    if (!selectedDay) return;
    let h = hour % 12;
    if (period === "PM") h += 12;

    const bookingDate = new Date(selectedDay);
    bookingDate.setHours(h, Number(minute), 0, 0);

    const iso = bookingDate.toISOString();
    onChange(iso);
  }, [hour, minute, period, selectedDay]);

  return (
    <div className="flex items-center space-x-2">
      {/* Hour */}
      <div className="border border-neutral-120 rounded-lg px-3 py-1 text-sm font-medium tracking-wide text-neutral-110 bg-white select-none">
        {hour.toString().padStart(2, "0")}
      </div>

      <span className="text-sm font-medium tracking-wide text-neutral-110">:</span>

      {/* Minute */}
      <div className="border border-neutral-120 rounded-lg px-3 py-1 text-sm font-medium tracking-wide text-neutral-110 bg-white select-none">
        {minute}
      </div>

      {/* AM/PM */}
      <div className="border border-neutral-120 rounded-lg px-3 py-1 text-sm font-medium tracking-wide text-neutral-110 bg-white select-none">
        {period}
      </div>
    </div>
  );
};

export default React.memo(TimePicker);

// import React, { useState, useEffect } from "react";

// type TimePickerProps = {
//   selectedDay: Date;
//   onChange: (value: string) => void; // bookingDate in ISO format
//   disabled?: boolean;
// };

// const TimePicker = ({ selectedDay, onChange, disabled = true }: TimePickerProps) => {
//   const [hour, setHour] = useState(7);
//   const [minute, setMinute] = useState("00");
//   const [period, setPeriod] = useState("PM");

//   useEffect(() => {
//     if (!selectedDay) return;
//     let h = hour % 12;
//     if (period === "PM") h += 12;

//     const bookingDate = new Date(selectedDay);
//     bookingDate.setHours(h, Number(minute), 0, 0);

//     const iso = bookingDate.toISOString();
//     onChange(iso);
//   }, [hour, minute, period, selectedDay]);

//   return (
//     <div className="flex items-center space-x-2">
//       {/* Hour */}
//       <div className="border border-neutral-120 rounded-lg px-3 py-1 text-sm font-medium tracking-wide text-neutral-110 bg-white select-none">
//         {hour.toString().padStart(2, "0")}
//       </div>

//       <span className="text-sm font-medium tracking-wide text-neutral-110">:</span>

//       {/* Minute */}
//       <div className="border border-neutral-120 rounded-lg px-3 py-1 text-sm font-medium tracking-wide text-neutral-110 bg-white select-none">
//         {minute}
//       </div>

//       {/* AM/PM */}
//       <div className="border border-neutral-120 rounded-lg px-3 py-1 text-sm font-medium tracking-wide text-neutral-110 bg-white select-none">
//         {period}
//       </div>
//     </div>
//   );
// };

// export default React.memo(TimePicker);

