import React from "react";

interface StatusCardProps {
  icon: string | React.ReactNode;
  value: number | string;
  label: string;
  badgeText: string;
  badgeBg: string;
  badgeBorder: string;
  badgeTextColor: string;
}

const StatusCard: React.FC<StatusCardProps> = ({
  icon,
  value,
  label,
  badgeText,
  badgeBg,
  badgeBorder,
  badgeTextColor,
}) => {
  return (
    <div className="bg-white rounded-lg p-4 space-y-6 font-Montserrat">
      <div className="flex justify-between items-center">
        <div className="size-[30px] p-[6px] bg-surface-40 flex justify-center items-center rounded-sm">
          {typeof icon === "string" ? (
            <img src={icon} alt="icon" className="size-6" />
          ) : (
            icon
          )}
        </div>
        <div
          className={`border p-1 flex justify-center items-center rounded-sm ${badgeBorder} ${badgeBg}`}
        >
          <p className={`leading-4 text-[13px] font-medium ${badgeTextColor}`}>
            {badgeText}
          </p>
        </div>
      </div>
      <div className="space-y-1 font-medium">
        <p className="text-[28px] leading-[32px]">{value}</p>
        <p className="leading-[22px]">{label}</p>
      </div>
    </div>
  );
};

export default StatusCard;
