import { baseApi } from "../../Api/baseApi";

const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategories: builder.query({
      query: ({ keyword, page }: { keyword?: string; page?: number }) => {
        const params = new URLSearchParams();

        if (keyword) params.append("keyword", keyword);
        if (page) params.append("page", page.toString());

        return {
          url: `/category${params.toString() ? `?${params.toString()}` : ""}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["category"],
    }),
    
    addCategory: builder.mutation({
      query: (data) => ({
        url: "/category/add",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["category"],
    }),

    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/category/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["category"],
    }),
  }),
});

export const { useGetAllCategoriesQuery, useAddCategoryMutation, useDeleteCategoryMutation } = categoryApi;
