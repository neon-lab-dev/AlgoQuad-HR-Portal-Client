import { baseApi } from "../../Api/baseApi";

const couponCodeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCouponCodes: builder.query({
      query: ({ keyword, page }: { keyword?: string; page?: number }) => {
        const params = new URLSearchParams();

        if (keyword) params.append("keyword", keyword);
        if (page) params.append("page", page.toString());

        return {
          url: `/coupon-code${params.toString() ? `?${params.toString()}` : ""}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["couponCode"],
    }),
    
    
    addCouponCode: builder.mutation({
      query: (data) => ({
        url: "/coupon-code/add",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["couponCode"],
    }),

    deleteCouponCode: builder.mutation({
      query: (id) => ({
        url: `/coupon-code/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["couponCode"],
    }),

    validateCouponCode: builder.mutation({
      query: (data) => ({
        url: `/coupon-code/validate`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["couponCode"],
    }),
  }),
});

export const { useGetAllCouponCodesQuery, useAddCouponCodeMutation, useDeleteCouponCodeMutation, useValidateCouponCodeMutation } = couponCodeApi;
