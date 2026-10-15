import { baseApi } from "../../Api/baseApi";

const chatAndChillApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getAllConsultations: builder.query({
      query: ({
        keyword,
        page,
        status,
      }: {
        keyword?: string;
        page?: number;
        status?: string;
      }) => {
        const params = new URLSearchParams();

        if (keyword) params.append("keyword", keyword);
        if (page) params.append("page", page.toString());
        if (status) params.append("status", status);

        return {
          url: `/chat-and-chill${
            params.toString() ? `?${params.toString()}` : ""
          }`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["chatAndChill"],
    }),

    getSingleConsultationById: builder.query({
      query: (id) => ({
        url: `/chat-and-chill/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["chatAndChill"],
    }),

    getAllBookingsByUserId: builder.query({
      query: (id) => ({
        url: `/chat-and-chill/user/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["chatAndChill"],
    }),

    getMyBookings: builder.query({
      query: ({
        page,
      }: {
        page?: number;
      }) => {
        const params = new URLSearchParams();

        if (page) params.append("page", page.toString());

        return {
          url: `/chat-and-chill/my-bookings${
            params.toString() ? `?${params.toString()}` : ""
          }`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["chatAndChill"],
    }),

    scheduleMeeting: builder.mutation({
      query: (data) => ({
        url: `/chat-and-chill/schedule-meeting`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["chatAndChill"],
    }),

    reScheduleMeeting: builder.mutation({
      query: (data) => ({
        url: `/chat-and-chill/re-schedule-meeting`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["chatAndChill"],
    }),

    updateStatus: builder.mutation({
      query: ({ data, id }) => ({
        url: `/chat-and-chill/update-status/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["chatAndChill"],
    }),

    checkout: builder.mutation({
      query: (data) => ({
        url: `/chat-and-chill/checkout`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["chatAndChill"],
    }),

    bookChatAndChill: builder.mutation({
      query: (data) => ({
        url: `/chat-and-chill/book`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["chatAndChill"],
    }),
  }),
});

export const {
  useGetAllConsultationsQuery,
  useGetSingleConsultationByIdQuery,
  useGetAllBookingsByUserIdQuery,
  useGetMyBookingsQuery,
  useScheduleMeetingMutation,
  useReScheduleMeetingMutation,
  useUpdateStatusMutation,
  useCheckoutMutation,
  useBookChatAndChillMutation,
} = chatAndChillApi;
