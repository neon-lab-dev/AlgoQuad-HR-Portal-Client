import React from 'react'
type RecentActivitiesCardProps = {
  icon: string;
  title: string;
  description: string;
  arrowIcon?: string;
  date?:string
};
const RecentActivitiesCard: React.FC<RecentActivitiesCardProps> = ({ icon,
  title,
  description,
}) => {
  return (
    <div className="border-[1px] border-neutral-98 w-full rounded-lg bg-neutral-100 p-4">
      <div className="flex w-full justify-between items-start gap-4">
        <div className="size-[30px] p-[6px] bg-surface-40 flex justify-center items-center rounded-full">
          <img src={icon} className="size-6" />
        </div>
        <div className="flex-1 w-full space-y-1 text-neutral-20">
          <h3 className="leading-[22px] font-medium">{title}</h3>
          <p className="text-[13px] leading-[16px]">{description}</p>
          <p className='text-neutral-85 text-[11px] leading-3.5 mt-4'>1 Auges 2024</p>
        </div>
      </div>
     
    </div>
  )
}

export default RecentActivitiesCard