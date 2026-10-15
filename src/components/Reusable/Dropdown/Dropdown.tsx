import React, { useState } from "react";
import { ICONS } from "../../../assets";

type Option = {
  value: string;
  label: string;
  disabled?: boolean;
};

type DropdownProps = {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  className?: string;
};

const Dropdown: React.FC<DropdownProps> = ({
  value,
  onChange,
  options,
  className = "",
}) => {
  const [open, setOpen] = useState(false);

  const selected = options.find((opt) => opt.value === value);

  return (
    <div className={`relative w-fit font-Montserrat ${className}`}>
      {/* Selected box */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-3 py-2 border text-sm border-gray-300 rounded-lg flex justify-between items-center bg-white cursor-pointer"
      >
        <span>{selected ? selected.label : "Select an option"}</span>
        <img
          src={ICONS.arrowDown}
          alt="Dropdown Icon"
          className="h-4 w-4 ml-2"
        />
      </button>

      {/* Dropdown options */}
      {open && (
        <ul className="absolute mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          {options.map((opt) => (
            <li
              key={opt.value}
              onClick={() => {
                if (!opt.disabled) {
                  onChange(opt.value);
                  setOpen(false);
                }
              }}
              className={`px-3 py-2 cursor-pointer hover:bg-primary-30 capitalize ${
                value === opt.value ? "bg-primary-30 font-semibold" : ""
              } ${
                opt.disabled
                  ? "opacity-50 cursor-not-allowed hover:bg-white"
                  : ""
              }`}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
