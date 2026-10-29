/* eslint-disable @typescript-eslint/no-explicit-any */

export type TEmployee = {
    _id: string,
    employeeId: string,
    userId: any,
    department: string,
    designation: string,
    joiningDate: Date,
    employmentType: string,
    accountStatus: string,
    createdAt?: string,
    updatedAt?: string
};