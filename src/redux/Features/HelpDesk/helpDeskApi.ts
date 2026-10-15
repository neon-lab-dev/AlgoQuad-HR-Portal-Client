import { baseApi } from "../../Api/baseApi";

const helpDeskApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllQueries: builder.query({
      query: ({ keyword, status, page, limit }: { keyword?: string; status?: string; page?: number ; limit?: number }) => {
        const params = new URLSearchParams();

        if (keyword) params.append("keyword", keyword);
        if (status) params.append("status", status);
        if (page) params.append("page", page.toString());
        if (limit) params.append("limit", limit.toString());

        return {
          url: `/helpdesk${params.toString() ? `?${params.toString()}` : ""}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["helpdesk"],
    }),

    getMyQueries: builder.query({
      query: ({ keyword, status, page, limit }: { keyword?: string; status?: string; page?: number ; limit?: number }) => {
        const params = new URLSearchParams();

        if (keyword) params.append("keyword", keyword);
        if (status) params.append("status", status);
        if (page) params.append("page", page.toString());
        if (limit) params.append("limit", limit.toString());

        return {
          url: `/helpdesk/my-queries${params.toString() ? `?${params.toString()}` : ""}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["helpdesk"],
    }),
    
    raiseQuery: builder.mutation({
      query: (data) => ({
        url: "/helpdesk/raise-query",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["helpdesk"],
    }),

    updateQueryStatus: builder.mutation({
      query: ({id, data}) => ({
        url: `/helpdesk/update-status/${id}`,
        method: "PATCH",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["helpdesk"],
    }),

    deleteQuery: builder.mutation({
      query: (id) => ({
        url: `/helpdesk/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["helpdesk"],
    }),
  }),
});

export const { useGetAllQueriesQuery, useGetMyQueriesQuery, useRaiseQueryMutation, useUpdateQueryStatusMutation, useDeleteQueryMutation } = helpDeskApi;
