import { ICONS } from "../../../assets";

export type Option = {
  label: string;
  value: string;
};

type FiltrationDropdownProps = {
  label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
};

const FiltrationDropdown: React.FC<FiltrationDropdownProps> = ({
  label,
  options,
  value,
  onChange,
}) => {
  return (
    <div className="relative w-full">
      {/* Accessible label (hidden visually but for screen readers) */}
      <label className="sr-only">{label}</label>

      <select
        className="w-fit appearance-none rounded-lg border border-surface-90 bg-white md:px-6 py-2 px-3 md:py-4 pr-10 text-xs md:text-[15px] font-medium font-Montserrat text-neutral-50 focus:ring-none focus:outline-none cursor-pointer"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{label}</option>
        {
        options?.length < 1 ?
        <option value="" disabled>No option available</option> :
        options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="capitalize"
          >
            {option.label}
          </option>
        ))}
      </select>

      {/* Custom dropdown arrow */}
      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
        <img
          src={ICONS.arrowDown}
          alt="Dropdown arrow"
          className="w-4 h-4"
        />
      </div>
    </div>
  );
};

export default FiltrationDropdown;
