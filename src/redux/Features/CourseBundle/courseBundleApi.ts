import { baseApi } from "../../Api/baseApi";

const courseBundleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCourseBundles: builder.query({
      query: ({ keyword, page }: { keyword?: string; page?: number }) => {
        const params = new URLSearchParams();

        if (keyword) params.append("keyword", keyword);
        if (page) params.append("page", page.toString());

        return {
          url: `/course-bundle${params.toString() ? `?${params.toString()}` : ""}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["courseBundle"],
    }),

    getSingleCourseBundleById: builder.query({
      query: (id) => ({
        url: `/course-bundle/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["courseBundle"],
    }),

    addCourseBundle: builder.mutation({
      query: (data) => ({
        url: `/course-bundle/create`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["courseBundle"],
    }),

    updateCourseBundle: builder.mutation({
      query: ({ data, id }) => ({
        url: `/course-bundle/update/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["courseBundle"],
    }),

    deleteCourseBundle: builder.mutation({
      query: (id) => ({
        url: `/course-bundle/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["courseBundle"],
    }),
  }),
});

export const {
  useGetAllCourseBundlesQuery,
  useGetSingleCourseBundleByIdQuery,
  useAddCourseBundleMutation,
  useUpdateCourseBundleMutation,
  useDeleteCourseBundleMutation,
} = courseBundleApi;
