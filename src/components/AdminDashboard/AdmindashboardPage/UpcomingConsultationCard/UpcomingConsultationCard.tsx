import { FiCalendar, FiMail, FiPhone, FiVideo, FiUser } from "react-icons/fi";

interface Consultation {
  id: string;
  name: string;
  email: string;
  phone: string;
  bookingDate: string;
  meetingLink: string;
  topics?: string[];
}

interface UpcomingConsultationCardProps {
  consultation: Consultation;
}

const UpcomingConsultationCard = ({
  consultation,
}: UpcomingConsultationCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const { date, time } = formatDate(consultation.bookingDate);

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 p-4">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
            <FiUser className="text-primary-10" size={18} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">
              {consultation.name}
            </h3>
            {/* Booking Date */}
            <div className="flex items-center gap-2">
              <FiCalendar className="text-primary-10 text-xs" />
              <div className="text-xs">
                <span className="font-medium text-gray-900">{date}</span>
                <span className="text-gray-600 ml-2">{time}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center gap-1 text-sm">
          <FiMail className="text-gray-400" size={14} />
          <span className="text-gray-600">{consultation.email}</span>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <FiPhone className="text-gray-400" size={14} />
          <span className="text-gray-600">{consultation.phone}</span>
        </div>
      </div>

      {/* Join Meeting Button */}
      <a
        href={consultation.meetingLink}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full bg-primary-10 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2"
      >
        <FiVideo size={16} />
        Join Meeting
      </a>
    </div>
  );
};

export default UpcomingConsultationCard;
