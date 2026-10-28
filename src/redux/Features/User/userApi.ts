import { baseApi } from "../../Api/baseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query({
      query: () => ({
        url: "/employee/my-profile",
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
  }),
});

export const {
  useGetMeQuery,
  useUpdateProfileMutation,
} = userApi;
