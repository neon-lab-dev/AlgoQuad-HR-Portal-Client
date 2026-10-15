import { Link } from "react-router-dom";
import { ICONS } from "../../../../assets";

interface SubscriptionQuickCardProps {
  icon: string;
  title: string;
  description: string;
  subTitle: string;
  path:string;
}

const SubscriptionQuickCard: React.FC<SubscriptionQuickCardProps> = ({
  icon,
  title,
  description,
  subTitle,
  path,
}) => {
  return (
    <div className="border-[1px] border-neutral-98 h-fit w-full rounded-lg bg-neutral-100 p-4 cursor-pointer hover:bg-neutral-95 transition">
      <Link to={path} className="flex w-full h-full justify-between items-center" >
        <div className="flex items-start justify-start  gap-4">
            {/* Left Icon */}
        <div className="size-[30px] p-[6px] bg-secondary-25 flex justify-center items-center rounded-full">
          <img src={icon} alt={title} className="size-6" />
        </div>

        {/* Content */}
        <div className="flex-1 w-full space-y-1 text-neutral-20">
          <h3 className="leading-[22px] font-medium">{title}</h3>
          <p className="text-[13px] leading-[16px]">{subTitle} </p>
          <p className="text-neutral-85 text-[11px] leading-3.5 mt-4">
            {description}
          </p>
        </div>
        </div>
        

        {/* Right Arrow */}
        <div className="h-full flex flex-col items-center justify-center">
          <img src={ICONS.rightArrow} alt={title} className="size-6" />
        </div>
      </Link>
    </div>
  );
};

export default SubscriptionQuickCard;
