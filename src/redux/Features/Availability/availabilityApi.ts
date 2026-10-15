import { baseApi } from "../../Api/baseApi";

const availabilityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllAvailability: builder.query({
      query: ({ keyword, page }: { keyword?: string; page?: number }) => {
        const params = new URLSearchParams();

        if (keyword) params.append("keyword", keyword);
        if (page) params.append("page", page.toString());

        return {
          url: `/availability${
            params.toString() ? `?${params.toString()}` : ""
          }`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["availability"],
    }),

    addAvailability: builder.mutation({
      query: (data) => ({
        url: "/availability/add",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["availability"],
    }),

    deleteAvailability: builder.mutation({
      query: (id) => ({
        url: `/availability/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["availability"],
    }),
  }),
});

export const {
  useGetAllAvailabilityQuery,
  useAddAvailabilityMutation,
  useDeleteAvailabilityMutation,
} = availabilityApi;
