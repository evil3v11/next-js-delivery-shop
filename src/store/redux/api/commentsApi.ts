import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  ArticleComment,
  GetCommentsResponse,
  PostCommentResponse,
  DeleteCommentResponse,
  PatchCommentResponse,
  LikeCommentResponse,
} from "@/app/(blog)/blog/_types";

export const commentsApi = createApi({
  reducerPath: "commentsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/blog" }),
  tagTypes: ["Comments"],
  endpoints: (builder) => ({
    getComments: builder.query<ArticleComment[], string, GetCommentsResponse>({
      query: (articleId) => `/comments?articleId=${articleId}`,
      providesTags: ["Comments"],
    }),
    createComment: builder.mutation<PostCommentResponse, Partial<ArticleComment>>({
      query: (commentData) => ({
        url: `/comments`,
        method: "POST",
        body: commentData,
      }),
      invalidatesTags: ["Comments"],
    }),
    updateComment: builder.mutation<PatchCommentResponse, Record<string, string>>({
      query: ({ commentId, ...rest }) => ({
        url: `/comments/${commentId}`,
        method: "PATCH",
        body: rest,
      }),
      invalidatesTags: ["Comments"],
    }),
    deleteComment: builder.mutation<DeleteCommentResponse, string>({
      query: (commentId) => ({
        url: `/comments/${commentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Comments"],
    }),
    likeComment: builder.mutation<LikeCommentResponse, Record<string, string>>({
      query: ({ commentId, userId }) => ({
        url: `/comments/${commentId}/like`,
        method: "POST",
        body: { userId },
      }),
      invalidatesTags: ["Comments"],
    }),
  }),
});

export const {
  useGetCommentsQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useLikeCommentMutation,
} = commentsApi;
