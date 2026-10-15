/* eslint-disable @typescript-eslint/no-explicit-any */

const styles: Record<any, string> = {
  New:       "bg-slate-100 text-slate-700 border-slate-300",
  Screening: "bg-yellow-100 text-yellow-700 border-yellow-300",
  Interview: "bg-indigo-100 text-indigo-700 border-indigo-300",
  Selected:  "bg-teal-100 text-teal-700 border-teal-300",
  Rejected:  "bg-red-100 text-red-700 border-red-300",
  Hired:     "bg-green-100 text-green-700 border-green-300",
};

const CandidateStatusBadge = ({ status }: { status: any }) => (
  <span
    className={`px-2 py-0.5 text-xs font-medium rounded-full border ${styles[status]}`}
  >
    {status}
  </span>
);
export default CandidateStatusBadge;