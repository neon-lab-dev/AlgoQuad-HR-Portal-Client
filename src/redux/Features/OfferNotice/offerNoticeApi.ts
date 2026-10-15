import { baseApi } from "../../Api/baseApi";

const offerNoticeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllOfferNotices: builder.query({
      query: ({ keyword, page }: { keyword?: string; page?: number }) => {
        const params = new URLSearchParams();

        if (keyword) params.append("keyword", keyword);
        if (page) params.append("page", page.toString());

        return {
          url: `/offer-notice${params.toString() ? `?${params.toString()}` : ""}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["offerNotice"],
    }),

     getSingleOfferNoticeById: builder.query({
      query: (id) => ({
        url: `/offer-notice/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["offerNotice"],
    }),
    
    addOfferNotice: builder.mutation({
      query: (data) => ({
        url: "/offer-notice/add",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["offerNotice"],
    }),

    updateOfferNotice: builder.mutation({
      query: ({id, data}) => ({
        url: `/offer-notice/update/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["offerNotice"],
    }),

    deleteOfferNotice: builder.mutation({
      query: (id) => ({
        url: `/offer-notice/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["offerNotice"],
    }),
  }),
});

export const { useGetAllOfferNoticesQuery, useGetSingleOfferNoticeByIdQuery, useAddOfferNoticeMutation, useUpdateOfferNoticeMutation, useDeleteOfferNoticeMutation } = offerNoticeApi;
