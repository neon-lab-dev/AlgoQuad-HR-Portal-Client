import { useSelector } from "react-redux";
import { IMAGES } from "../../../../assets";
import { useCurrentUser } from "../../../../redux/Features/Auth/authSlice";
import type { TUser } from "../../../../types/user.types";

const WelcomeSection = () => {
  const user = useSelector(useCurrentUser) as TUser;
  console.log(user);
  return (
    <div className="relative w-full h-fit flex rounded-2xl bg-primary-10 px-4 md:px-6 py-6 overflow-hidden font-Montserrat">
      <div className="absolute right-0 top-0 bottom-0 rounded-r-2xl h-full">
        <img src={IMAGES.dashboardLines} className="h-full" />
      </div>
      <div className="space-y-1 text-white flex flex-col justify-center z-10">
        <h2 className="text-2xl font-medium">
          {/* {`Welcome back, ${user?.name}!`} */}
          {`Welcome back, HR`}
        </h2>
        <p className="leading-[22px]">
          Here's an overview of your hiring activity today
        </p>
      </div>
    </div>
  );
};

export default WelcomeSection;