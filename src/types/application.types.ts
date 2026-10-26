/* eslint-disable @typescript-eslint/no-explicit-any */

export type TApplicationStatus =
  | "New"
  | "Screening"
  | "Interview"
  | "Selected"
  | "Rejected"
  | "Hired";

export type TApplicationSource =
  | "Website"
  | "Referral"
  | "LinkedIn"
  | "Facebook"
  | "BDJobs"
  | "Walk-in"
  | "Other";

export type TApplicationHistory = {
  status: TApplicationStatus;
  note?: string;
  changedBy?: any;
  at: Date;
};

export type TApplication = {
  _id?: string;
  name: string;
  email: string;
  phoneNumber: string;
  jobId: any;
  experience: string;          // e.g. "3 years" or free text
  resumeUrl: string;
  source: string;              // free-form (TApplicationSource | custom)
  resumeRating: number;        // 0–5
  status: TApplicationStatus;

  // Milestone timestamps for quick queries
  screeningAt?: Date | null;
  interviewAt?: Date | null;
  selectedAt?: Date | null;
  rejectedAt?: Date | null;
  hiredAt?: Date | null;

  history: TApplicationHistory[];

  addedBy?: any;    // admin/hr who manually added the candidate
  isDeleted: boolean;

  createdAt?: Date;
  updatedAt?: Date;
};