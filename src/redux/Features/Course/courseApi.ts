import { baseApi } from "../../Api/baseApi";

const courseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyCourses: builder.query({
      query: () => ({
        url: "/user/me",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["course"],
    }),
    getAllCourses: builder.query({
      query: ({ keyword, page }: { keyword?: string; page?: number }) => {
        const params = new URLSearchParams();

        if (keyword) params.append("keyword", keyword);
        if (page) params.append("page", page.toString());

        return {
          url: `/course${params.toString() ? `?${params.toString()}` : ""}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["course"],
    }),

    getSingleCourseById: builder.query({
      query: (id) => ({
        url: `/course/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["course"],
    }),

    getAllLecturesByCourseId: builder.query({
      query: (id) => ({
        url: `/course-lecture/all/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["course"],
    }),

    addCourse: builder.mutation({
      query: (data) => ({
        url: `/course/add`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["course"],
    }),

    updateCourse: builder.mutation({
      query: ({ data, id }) => ({
        url: `/course/update/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["course"],
    }),

    deleteCourse: builder.mutation({
      query: (id) => ({
        url: `/course/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["course"],
    }),

    addLecture: builder.mutation({
      query: (data) => ({
        url: `/course-lecture/add`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["course"],
    }),

    deleteLecture: builder.mutation({
      query: (lectureId) => ({
        url: `/course-lecture/delete/${lectureId}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["course"],
    }),

     getAllQuestionsOfCourse: builder.query({
      query: (courseId) => ({
        url: `/exam/${courseId}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["course"],
    }),

    createExam: builder.mutation({
      query: (data) => ({
        url: `/exam/create`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["course"],
    }),

    updateExam: builder.mutation({
      query: ({ data, examId }) => ({
        url: `/exam/update/${examId}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["course"],
    }),

    courseCheckout: builder.mutation({
      query: (data) => ({
        url: `/course-order/checkout`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["course"],
    }),

    createCourseOrder: builder.mutation({
      query: (data) => ({
        url: `/course-order/create`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["course"],
    }),

    completeLecture: builder.mutation({
      query: ({courseId, lectureId}) => ({
        url: `/course/${courseId}/lectures/${lectureId}/complete`,
        method: "PUT",
        credentials: "include",
      }),
      invalidatesTags: ["course"],
    }),

    completeCourse: builder.mutation({
      query: (courseId) => ({
        url: `/course/${courseId}/complete`,
        method: "PUT",
        credentials: "include",
      }),
      invalidatesTags: ["course"],
    }),
    getExamByCourseId: builder.query({
      query: (id) => ({
        url: `/exam/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["course"],
    }),
     submitExam: builder.mutation({
      query: ({data}) => ({
        url: `/exam-answer/attend`,
        method: "POST",
        body:data,
        credentials: "include",
      }),
      invalidatesTags: ["course"],
    }),
  }),
});

export const {
  useGetMyCoursesQuery,
  useGetAllCoursesQuery,
  useGetSingleCourseByIdQuery,
  useGetAllLecturesByCourseIdQuery,
  useAddCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useAddLectureMutation,
  useDeleteLectureMutation,
  useGetAllQuestionsOfCourseQuery,
  useCreateExamMutation,
  useUpdateExamMutation,
  useCourseCheckoutMutation,
  useCreateCourseOrderMutation,
  useCompleteLectureMutation,
  useCompleteCourseMutation,
  useGetExamByCourseIdQuery,
  useSubmitExamMutation,
} = courseApi;
