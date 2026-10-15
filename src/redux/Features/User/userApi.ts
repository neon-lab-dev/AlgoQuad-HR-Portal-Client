import { baseApi } from "../../Api/baseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query({
      query: () => ({
        url: "/user/me",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["user"],
    }),

    updateProfile: builder.mutation({
      query: (data) => ({
        url: `/user/update-profile/`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["user"],
    }),

    getMyActivity: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/activity/my-activities`,
        method: "GET",
        credentials: "include",
        params: { page, limit },
      }),
      providesTags: ["user"],
    }),

    getRazorpayKey: builder.query({
      query: () => ({
        url: "/get-key",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["user"],
    }),
  }),
});

export const {
  useGetMeQuery,
  useUpdateProfileMutation,
  useGetMyActivityQuery,
  useGetRazorpayKeyQuery,
} = userApi;
