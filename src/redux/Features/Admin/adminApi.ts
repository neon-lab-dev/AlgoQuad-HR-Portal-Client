import { baseApi } from "../../Api/baseApi";

const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminStats: builder.query({
      query: () => ({
        url: `/admin/overview`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["jobs"],
    }),
  }),
});

export const { useGetAdminStatsQuery } = adminApi;
