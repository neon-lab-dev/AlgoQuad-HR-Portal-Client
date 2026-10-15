import { baseApi } from "../../Api/baseApi";

const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminStats: builder.query({
      query: () => ({
        url: `/admin/overview`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["course"],
    }),
  }),
});

export const { useGetAdminStatsQuery } = adminApi;
