import { ICONS } from "../../../../assets"
import { formatDate } from "../../../../utils/formatDate"
import SubscriptionCard from "../SubscriptionCard/SubscriptionCard"

const SubscriptionCardsList = ({status, nextBilling} : {status: string, nextBilling: string}) => {
  const cards = [
    {
      icon: ICONS.medal,
      value: status,
      label: "Subscription Status",
    },
    {
      icon: ICONS.calendarMinimalistic,
      value: formatDate(nextBilling),
      label: "Next Billing (Manual Payment)",
    },
  ]

  return (
    <div className="flex flex-col md:flex-row gap-6 mt-4">
      {cards.map((card) => {
        // compute conditional class for the value
        const classNames =
          card.value === "active"
            ? "text-success-20"
            : card.value === "Paused" || card.value === "cancelled"
            ? "text-primary-15"
            : card.value === "Not Available"
            ? "text-primary-40"
            : "text-neutral-10";

        return (
          <SubscriptionCard
            key={card.label}
            icon={card.icon}
            value={card.value}
            label={card.label}
            classNames={classNames}
          />
        );
      })}
    </div>
  )
}

export default SubscriptionCardsList
