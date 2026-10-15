/* eslint-disable @typescript-eslint/no-explicit-any */


const styles: Record<any, string> = {
  Draft: "bg-slate-100 text-slate-600 border-slate-300",
  Active: "bg-green-100 text-green-700 border-green-300",
  Closed: "bg-orange-100 text-orange-700 border-orange-300",
  Inactive: "bg-red-100 text-red-700 border-red-300",
};

const JobStatusBadge = ({ status }: { status: any }) => (
  <span
    className={`px-2 py-0.5 text-xs font-medium rounded-full border ${styles[status]}`}
  >
    {status}
  </span>
);
export default JobStatusBadge;