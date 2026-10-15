import React from "react";
import { ICONS } from "../../../../assets";
import Button from "../../../Reusable/Button/Button";

interface ConfirmationCardProps {
  type: "success" | "cancel" | "paused";
  title?: string;
  message?: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
}

const ConfirmationCard: React.FC<ConfirmationCardProps> = ({
  type,
  title,
  message,
  buttonLabel = "Go to Dashboard",
  onButtonClick,
}) => {
  const config = {
    success: {
      color: "bg-[#16A34A]",
      icon: ICONS.tickMark,
      defaultTitle: "Payment Successful!",
      defaultMessage:
        "You will receive an email shortly, regarding the joining link of the Boardroom Banter WhatsApp group!",
    },
    cancel: {
      color: "bg-[#DC2626]",
      icon: ICONS.cross, // make sure you have this in ICONS
      defaultTitle: "Payment Cancelled!",
      defaultMessage:
        "Your payment was cancelled. Please try again or contact support.",
    },
    paused: {
      color: "bg-[#F59E0B]",
      icon: ICONS.pauseCircle, // make sure you have this in ICONS
      defaultTitle: "Subscription Paused!",
      defaultMessage:
        "Your subscription has been paused successfully. You can resume it anytime from dashboard.",
    },
  };

  const { color, icon, defaultTitle, defaultMessage } = config[type];

  return (
    <div className="bg-white border-[1px] rounded-2xl border-neutral-98 flex items-center justify-center px-6 pt-6 pb-8">
      <div className="flex flex-col items-center">
        <div
          className={`size-11 rounded-full ${color} flex items-center justify-center mt-19`}
        >
          <img src={icon} alt={type} className="size-6" />
        </div>
        <h1 className="text-neutral-10 text-[28px] font-medium leading-8 mt-4 text-center">
          {title || defaultTitle}
        </h1>
        <p className="text-neutral-10 text-[15px] font-medium leading-[18px] mt-8 text-center">
          {message || defaultMessage}
        </p>
        <Button
          variant="custom"
          label={buttonLabel}
          classNames="px-8 border-[1px] mt-12 border-surface-90 text-neutral-10 bg-surface-30"
          type="button"
          onClick={onButtonClick}
        />
      </div>
    </div>
  );
};

export default ConfirmationCard;
