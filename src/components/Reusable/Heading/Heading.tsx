import React from "react";
import { twMerge } from "tailwind-merge";

interface SectionTitleProps {
  heading: string;
  subHeading?: string;
  color?: string;
  subtextColor?: string;
  className?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({
  heading,
  subHeading,
  color = "text-secondary-15",
  subtextColor = "text-gray-600",
  className = "",
}) => {
  const headingClasses = twMerge(
    "text-center -tracking-[0.16px] text-[32px] font-bold leading-[36px] mb-3 capitalize",
    color,
    className
  );

  const subtextClasses = twMerge(
    "text-center text-[16px] leading-[24px] font-medium text-neutral-5",
    subtextColor
  );

  return (
    <div className="pb-6 font-Montserrat">
      <h1 className={headingClasses}>{heading}</h1>
      {subHeading && <p className={subtextClasses}>{subHeading}</p>}
    </div>
  );
};

export default SectionTitle;
