import { baseApi } from "../../Api/baseApi";

const boardroomBanterApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSubscriptions: builder.query({
      query: ({
        keyword,
        page,
        status,
        isAddedToWhatsappGroup,
        isSuspended,
        isRemoved,
      }: {
        keyword?: string;
        page?: number;
        status?: string;
        isAddedToWhatsappGroup?: boolean;
        isSuspended?: boolean;
        isRemoved?: boolean;
      }) => {
        const params = new URLSearchParams();

        if (keyword) params.append("keyword", keyword);
        if (page) params.append("page", page.toString());
        if (status) params.append("status", status);

        if (typeof isAddedToWhatsappGroup === "boolean") {
          params.append(
            "isAddedToWhatsappGroup",
            String(isAddedToWhatsappGroup)
          );
        }
        if (typeof isSuspended === "boolean") {
          params.append("isSuspended", String(isSuspended));
        }
        if (typeof isRemoved === "boolean") {
          params.append("isRemoved", String(isRemoved));
        }

        return {
          url: `/boardroom-banter-subscription${
            params.toString() ? `?${params.toString()}` : ""
          }`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["boardroomBanter"],
    }),

    getSingleConsultationById: builder.query({
      query: (id) => ({
        url: `/boardroom-banter-subscription/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["boardroomBanter"],
    }),

    getMySubscription: builder.query({
      query: () => ({
        url: `/boardroom-banter-subscription/my-subscription`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["boardroomBanter"],
    }),

    pauseSubscription: builder.mutation({
      query: (data) => ({
        url: `/boardroom-banter-subscription/pause`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["boardroomBanter"],
    }),

    //Not being used anymore
    resumeSubscription: builder.mutation({
      query: () => ({
        url: `/boardroom-banter-subscription/resume`,
        method: "POST",
        credentials: "include",
      }),
      invalidatesTags: ["boardroomBanter"],
    }),

    //Not being used anymore
    cancelSubscription: builder.mutation({
      query: (data) => ({
        url: `/boardroom-banter-subscription/cancel`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["boardroomBanter"],
    }),

    updateWhatsAppStatus: builder.mutation({
      query: (data) => ({
        url: `/boardroom-banter-subscription/update-whatsapp-status`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["boardroomBanter"],
    }),

    suspendUser: builder.mutation({
      query: (id) => ({
        url: `/boardroom-banter-subscription/suspend/${id}`,
        method: "PUT",
        credentials: "include",
      }),
      invalidatesTags: ["boardroomBanter"],
    }),

    withdrawSuspension: builder.mutation({
      query: (id) => ({
        url: `/boardroom-banter-subscription/withdraw-suspension/${id}`,
        method: "PUT",
        credentials: "include",
      }),
      invalidatesTags: ["boardroomBanter"],
    }),

    joinWaitlist: builder.mutation({
      query: (data) => ({
        url: `/boardroom-banter-subscription/join-waitlist`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["boardroomBanter"],
    }),

    sendCouponCode: builder.mutation({
      query: (data) => ({
        url: `/boardroom-banter-subscription/send-coupon-code`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["boardroomBanter"],
    }),

    createSubscription: builder.mutation({
      query: () => ({
        url: `/boardroom-banter-subscription/create`,
        method: "POST",
        credentials: "include",
      }),
      invalidatesTags: ["boardroomBanter"],
    }),
  }),
});

export const {
  useGetAllSubscriptionsQuery,
  useGetSingleConsultationByIdQuery,
  useGetMySubscriptionQuery,
  useUpdateWhatsAppStatusMutation,
  usePauseSubscriptionMutation,
  useResumeSubscriptionMutation,
  useCancelSubscriptionMutation,
  useSuspendUserMutation,
  useWithdrawSuspensionMutation,
  useJoinWaitlistMutation,
  useSendCouponCodeMutation,
  useCreateSubscriptionMutation,
} = boardroomBanterApi;
