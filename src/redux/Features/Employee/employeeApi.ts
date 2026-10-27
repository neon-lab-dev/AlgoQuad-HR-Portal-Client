/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../Api/baseApi";

const employeeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllEmployees: builder.query<
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
          url: `/employee?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["employee"],
    }),

    getSingleEmployeeById: builder.query({
      query: (id) => ({
        url: `/employee/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["employee"],
    }),

    addEmployee: builder.mutation<any, any>({
      query: (data) => ({
        url: `/employee/add`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["employee"],
    }),

    deleteEmployee: builder.mutation<any, string>({
      query: (id) => ({
        url: `/employee/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["employee"],
    }),

    updateEmployee: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `/employee/update/${id}`,
        method: "PATCH",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["employee"],
    }),
  }),
});

export const {
  useGetAllEmployeesQuery,
  useGetSingleEmployeeByIdQuery,
  useAddEmployeeMutation,
  useDeleteEmployeeMutation,
  useUpdateEmployeeMutation,
} = employeeApi;
