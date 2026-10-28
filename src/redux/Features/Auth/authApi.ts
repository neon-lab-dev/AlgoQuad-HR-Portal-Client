import { baseApi } from "../../Api/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (loginData) => ({
        url: "/auth/signup",
        method: "POST",
        body: loginData,
        credentials: "include",
      }),
      invalidatesTags: ["user"],
    }),

    verifyOtp: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body: userInfo,
        credentials: "include",
      }),
      invalidatesTags: ["user"],
    }),

    login: builder.mutation({
      query: (loginData) => ({
        url: "/auth/login",
        method: "POST",
        body: loginData,
        credentials: "include",
      }),
      invalidatesTags: ["user"],
    }),

    setupProfile: builder.mutation({
      query: (userInfo) => ({
        url: "/register",
        method: "POST",
        body: userInfo,
        credentials: "include",
      }),
      invalidatesTags: ["user"],
    }),

    logoutUser: builder.query({
      query: () => ({
        method: "PUT",
        url: `/logout`,
        credentials: "include",
      }),
      providesTags: ["user"],
    }),

    forgotPassword: builder.mutation({
      query: (forgotPasswordData) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: forgotPasswordData,
        credentials: "include",
      }),
      invalidatesTags: ["user"],
    }),

    resetPassword: builder.mutation({
      query: (data) => ({
        url: `/auth/reset-password`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["user"],
    }),

    
  }),
});

export const {
  useSignupMutation,
  useVerifyOtpMutation,
  useLoginMutation,
  useSetupProfileMutation,
  useLogoutUserQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
