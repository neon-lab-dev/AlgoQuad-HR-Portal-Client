import { type ReactNode } from "react";
interface SubscriptionStatusProps {
  children: ReactNode;
}
const SubscriptionStatus = ({ children }: SubscriptionStatusProps) => {
  return (
    <div className="bg-white border-[1px] border-neutral-98 rounded-[20px] p-6 gap-6">
      <div> {children}</div>
      
    </div>
  );
};

export default SubscriptionStatus;
