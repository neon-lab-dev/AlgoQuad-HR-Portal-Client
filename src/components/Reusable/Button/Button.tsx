import { twMerge } from "tailwind-merge";

interface ReusableButtonProps {
  label: string;
  variant?: "primary" | "secondary" | "tertiary" | "disabled" | "custom";
  onClick?: () => void;
  classNames?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  icon?: string;
  isLoading?: boolean;
}

const Button: React.FC<ReusableButtonProps> = ({
  label,
  variant = "secondary",
  onClick,
  classNames = "",
  type = "button",
  disabled = false,
  icon,
  isLoading = false,
}) => {
  const baseClasses =
    "text-[15px] leading-[18px] font-Montserrat -tracking-[0.16px] rounded-lg font-medium flex items-center gap-1 justify-center transition-all cursor-pointer disabled:cursor-not-allowed duration-300 ease-in-out transform px-4 py-4 whitespace-nowrap flex items-center justify-center gap-3";

  const variantClasses =
    variant === "primary"
      ? "bg-primary-10 disabled:bg-primary-10/70 text-white border-transparent hover:scale-105 active:scale-95 border-2 border-primary-10 disabled:border-primary-10/70 py-[10px]"
      : variant === "secondary"
      ? "border border-primary-10 text-primary-10 py-[10px] bg-transparent disabled:bg-gray-300 disabled:border-primary-10/70 hover:bg-primary-10 hover:text-white hover:scale-105 active:scale-95"
      : variant === "tertiary"
      ? "text-primary-15 bg-transparent py-4 px-8 hover:scale-105 active:scale-95"
      : variant === "disabled"
      ? "bg-neutral-150 text-neutral-90 cursor-not-allowed border-2 border-neutral-98 hover:none"
      : variant === "custom"
      ? "bg-neutral-150 text-neutral-90  border-2 border-neutral-98"
      : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={twMerge(`${baseClasses} ${variantClasses}`, classNames)}
    >
     {isLoading ? (
        "Loading..."
      ) : (
        <>
          {icon && <img src={icon} alt="icon" className="size-6" />}
          {label}
        </>
      )}
     
    </button>
  );
};

export default Button;
