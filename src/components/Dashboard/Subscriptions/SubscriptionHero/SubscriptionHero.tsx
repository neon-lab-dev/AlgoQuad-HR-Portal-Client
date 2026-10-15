import { IMAGES } from "../../../../assets";
import Button from "../../../Reusable/Button/Button";
import { useSelector } from "react-redux";
import { useCurrentUser } from "../../../../redux/Features/Auth/authSlice";
import type { TUser } from "../../../../types/user.types";
import { formatDate } from "../../../../utils/formatDate";
import type { TBoardRoomBanterSubscription } from "../../../../types/boardroomBanter.types";
import { Link } from "react-router-dom";

const SubscriptionHero = ({
  subscription,
}: {
  subscription: TBoardRoomBanterSubscription;
}) => {
  const user = useSelector(useCurrentUser) as TUser;
  const isDisabled =
    subscription?.status === "cancelled" ||
    subscription?.status === "expired" ||
    subscription?.status === "pending" ||
    subscription?.status === "waitlist" ||
    subscription?.status === "code sent" ||
    subscription?.status === "paused";

  return (
    <div className="relative w-full h-fit flex rounded-2xl bg-gradient-dashboard-card p-6 overflow-hidden font-Montserrat">
      <div className="absolute -right-2 top-0 bottom-0 rounded-r-2xl h-full">
        <img src={IMAGES.dashboardLines} className="h-full opacity-20" />
      </div>
      <div className="flex items-stretch justify-between w-full">
        <div className="space-y-6 text-white flex flex-col justify-center w-full">
          <div className="space-y-1">
            <h2 className="text-2xl font-medium">
              Welcome back, {user?.name}!
            </h2>
            <p className="text-neutral-165">
              {" "}
              Premium Chat Subscription <span className="px-4">|</span> Active
              since {formatDate(subscription?.createdAt)}
              <span className="px-4">|</span> ₹999/month
            </p>
          </div>

          <p className="leading-[22px] tet-sm text-neutral-100">
            Continue enjoying your premium subscription for private Whatsapp
            group with selected elite like minded people!{" "}
          </p>
          <Link to={"/dashboard/cancel-subscription"}>
          <Button
            variant="custom"
            label={"Cancel Subscription"}
            classNames="px-8 border-[1px] w-fit border-surface-90 text-neutral-20 bg-surface-30 text-[15px] font-medium disabled:bg-gray-300"
            disabled={isDisabled}
          />
          </Link>
        </div>
        <div
          className={`${
            subscription?.status == "active"
              ? " border-success-25 bg-surface-5 text-success-20"
              : " border-primary-35 bg-primary-30 text-primary-15"
          } text-n border-[1px] rounded-sm p-1 text-[13px] leading-4 font-medium w-fit text-nowrap h-fit capitalize`}
        >
          {subscription?.status}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionHero;
