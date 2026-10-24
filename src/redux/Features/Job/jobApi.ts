/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../Api/baseApi";

const jobApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllJobs: builder.query<
      any,
      {
        keyword?: string;
        status?: string;
        department?: string;
        skip?: number;
        limit?: number;
        page?: number;
      }
    >({
      query: (filters) => {
        const params = new URLSearchParams();

        if (filters.keyword) params.append("keyword", filters.keyword);

        if (filters.status && filters.status !== "all")
          params.append("status", filters.status);

        if (filters.department && filters.department !== "all")
          params.append("department", filters.department);

        if (filters.skip !== undefined)
          params.append("skip", String(filters.skip));

        if (filters.limit !== undefined)
          params.append("limit", String(filters.limit));

        if (filters.page !== undefined)
          params.append("page", String(filters.page));

        return {
          url: `/job?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["application", "jobs"],
    }),

    getSingleJobById: builder.query({
      query: (id) => ({
        url: `/job/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["jobs"],
    }),

    postJob: builder.mutation<any, any>({
      query: (data) => ({
        url: `/job/post`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["jobs"],
    }),

    deleteJob: builder.mutation<any, string>({
      query: (id) => ({
        url: `/job/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["jobs"],
    }),

    updateJob: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `/job/update/${id}`,
        method: "PATCH",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["jobs"],
    }),
  }),
});

export const {
  useGetAllJobsQuery,
  useGetSingleJobByIdQuery,
  usePostJobMutation,
  useDeleteJobMutation,
  useUpdateJobMutation,
} = jobApi;
