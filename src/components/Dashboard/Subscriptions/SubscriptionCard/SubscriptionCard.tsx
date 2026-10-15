import React from "react"

interface SubscriptionCardProps {
  icon: string
  value: string
  label: string
  classNames?: string
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ icon, value, label, classNames }) => {
  return (
    <div className="bg-white rounded-lg p-4 space-y-6 font-Montserrat w-full md:w-[280px] shadow-sm">
      <div className="size-[30px] p-[6px] bg-surface-40 flex justify-center items-center rounded-sm">
        <img src={icon} alt={label} className="size-6" />
      </div>

      <div className="space-y-1 font-medium">
        <p className={`text-[28px] leading-[32px] capitalize ${classNames}`}>{value}</p>
        <p className="leading-[22px] text-neutral-600">{label}</p>
      </div>
    </div>
  )
}

export default SubscriptionCard
