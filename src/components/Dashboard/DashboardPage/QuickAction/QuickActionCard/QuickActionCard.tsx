import React from "react";
import { ICONS } from "../../../../../assets";
import { Link } from "react-router-dom";

type QuickActionCardProps = {
  icon: string;
  title: string;
  description: string;
  link:string
};

const QuickActionCard: React.FC<QuickActionCardProps> = ({
  icon,
  title,
  description,
  link
}) => {
  return (
    <Link to={link} className="border-[1px] border-neutral-98 w-full rounded-lg bg-neutral-100 p-6 flex items-center justify-center">
      <div className="flex w-full justify-between items-center gap-4">
        <div className="size-[30px] p-[6px] bg-surface-40 flex justify-center items-center rounded-sm">
          <img src={icon} className="size-6" />
        </div>
        <div className="flex-1 w-full space-y-1 text-neutral-20">
          <h3 className="leading-[22px] font-medium">{title}</h3>
          <p className="text-[13px] leading-[16px]">{description}</p>
        </div>
      </div>
      <img src={ICONS.arrowDown} className="size-6 rotate-270" />
    </Link>
  );
};

export default QuickActionCard;
