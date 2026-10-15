import { baseApi } from "../../Api/baseApi";

const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    makePayment: builder.mutation({
      query: (data) => ({
        url: "/checkout",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["user"],
    }),

    createOrder: builder.mutation({
      query: (data) => ({
        url: "/create-order",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["user"],
    }),
  }),
});

export const { useMakePaymentMutation, useCreateOrderMutation } = paymentApi;
