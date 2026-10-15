import { ICONS } from "../../../assets";

const SuccessContent = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="size-11 rounded-full bg-[#16A34A] flex items-center justify-center">
        <img src={ICONS.tickMark} alt="" className="size-6" />
      </div>
      <h1 className="text-neutral-10 text-lg font-semibold leading-5 mt-8 text-center">
        Newsletter subscribed successfully!
      </h1>
      <p className="text-neutral-10 text-sm font-medium leading-[18px] mt-4 max-w-[550px] mx-auto text-center">
        Thanks for subscribing! You will receive your weekly newspaper in your
        inbox, do keep a check for your financial fluency!
      </p>
    </div>
  );
};

export default SuccessContent;
