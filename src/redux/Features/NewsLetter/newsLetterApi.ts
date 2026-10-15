import { baseApi } from "../../Api/baseApi";

const newsletterApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllNewsletter: builder.query({
      query: ({ keyword, page }: { keyword?: string; page?: number }) => {
        const params = new URLSearchParams();

        if (keyword) params.append("keyword", keyword);
        if (page) params.append("page", page.toString());

        return {
          url: `/newsletter${params.toString() ? `?${params.toString()}` : ""}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["newsletter"],
    }),
    
    subscribeNewsLetter: builder.mutation({
      query: (SubscribersData) => ({
        url: "/newsletter/subscribe",
        method: "POST",
        body: SubscribersData,
        credentials: "include",
      }),
      invalidatesTags: ["user"],
    }),

    deleteNewsletter: builder.mutation({
      query: (id) => ({
        url: `/newsletter/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["newsletter"],
    }),
  }),
});

export const { useGetAllNewsletterQuery, useSubscribeNewsLetterMutation,useDeleteNewsletterMutation } = newsletterApi;
