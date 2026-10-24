/* eslint-disable @typescript-eslint/no-explicit-any */

export type TEmploymentType = "Full-time" | "Part-time" | "Internship";
export type TJobStatus = "Active" | "Closed" | "Draft";

export type TJob = {
  _id: string;
  title: string;
  department: string;
  openings: number;
  description: string;
  skills: string[];
  location: string;
  employmentType: TEmploymentType;
  status: TJobStatus;
  responsibilities: string[];
  qualifications: string[];
  perks: string[];
  applications: string[];
  addedBy: any;
  createdAt?: Date;
  updatedAt?: Date;
};