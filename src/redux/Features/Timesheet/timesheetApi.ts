/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../Api/baseApi";

const timesheetApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

     getMyTimesheet: builder.query({
      query: ({ month, year }) => ({
        url: `/timesheet/my`,
        method: "GET",
        params: { month, year },
      }),
      providesTags: ["timesheet"],
    }),

    getTimesheetOfAnEmployee: builder.query({
      query: ({ id, month, year }: { id: string; month: number; year: number }) => ({
        url: `/timesheet/employee/${id}`,
        method: "GET",
        params: { month, year },
        credentials: "include",
      }),
      providesTags: ["timesheet"],
    }),

    addWorkingHour: builder.mutation<any, any>({
      query: (data) => ({
        url: `/timesheet/add-hours`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["timesheet"],
    }),
  }),
});

export const {
  useGetMyTimesheetQuery,
  useGetTimesheetOfAnEmployeeQuery,
  useAddWorkingHourMutation,
} = timesheetApi;
