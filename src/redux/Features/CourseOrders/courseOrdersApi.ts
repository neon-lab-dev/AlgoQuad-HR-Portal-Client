import { baseApi } from "../../Api/baseApi";

const courseOrdersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCourseOrders: builder.query({
      query: ({
        keyword,
        page,
      }: {
        keyword?: string;
        page?: number;
      }) => {
        const params = new URLSearchParams();

        if (keyword) params.append("keyword", keyword);
        if (page) params.append("page", page.toString());

        return {
          url: `/course-order${params.toString() ? `?${params.toString()}` : ""}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["courseOrder"],
    }),

    getSingleProductOrderById: builder.query({
      query: (id) => ({
        url: `/product-order/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["courseOrder"],
    }),

     getMyCourseOrders: builder.query({
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
          url: `/course-order/my-orders${params.toString() ? `?${params.toString()}` : ""}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["courseOrder"],
    }),

    addProduct: builder.mutation({
      query: (data) => ({
        url: `/product/add`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["courseOrder"],
    }),

    updateOrderStatus: builder.mutation({
      query: (data) => ({
        url: `/product-order/update-status`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["courseOrder"],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/product/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["courseOrder"],
    }),
  }),
});

export const {
  useGetAllCourseOrdersQuery,
  useGetSingleProductOrderByIdQuery,
  useGetMyCourseOrdersQuery,
  useAddProductMutation,
  useUpdateOrderStatusMutation,
  useDeleteProductMutation,
} = courseOrdersApi;
