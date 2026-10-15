import { baseApi } from "../../Api/baseApi";

const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: ({
        keyword,
        category,
        minPrice,
        maxPrice,
        page,
      }: {
        keyword?: string;
        category?: string;
        minPrice?: number;
        maxPrice?: number;
        page?: number;
      }) => {
        const params = new URLSearchParams();

        if (keyword) params.append("keyword", keyword);
        if (category) params.append("category", category);
        if (minPrice !== undefined)
          params.append("minPrice", minPrice.toString());
        if (maxPrice !== undefined)
          params.append("maxPrice", maxPrice.toString());
        if (page) params.append("page", page.toString());

        return {
          url: `/product${params.toString() ? `?${params.toString()}` : ""}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["product"],
    }),

    getSingleProductById: builder.query({
      query: (id) => ({
        url: `/product/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["product"],
    }),

    addProduct: builder.mutation({
      query: (data) => ({
        url: `/product/add`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["product"],
    }),

    updateProduct: builder.mutation({
      query: ({ data, id }) => ({
        url: `/product/update/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["product"],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/product/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["product"],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetSingleProductByIdQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
