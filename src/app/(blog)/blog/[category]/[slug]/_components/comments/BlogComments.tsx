"use client";

import { useMemo, useState } from "react";
import { useGetCommentsQuery } from "@/store/redux/api/commentsApi";

import { CONFIG } from "../../../../../../../../config/config";
import { ArticleComment, CommentSortOrder } from "@/app/(blog)/blog/_types";

import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import Loader from "@/components/Loader";
import CommentSortButtons from "./CommentSortButtons";
import LoadMoreCommentsButton from "./LoadMoreCommentsButton";

const BlogComments = ({ articleId }: { articleId: string }) => {
  const [sortOrder, setSortOrder] = useState<CommentSortOrder>("newest");
  const [visibleCommentsCount, setVisibleCommentsCount] = useState(
    CONFIG.COMMENTS_PER_ARTICLE_PAGE,
  );

  const { data = [], isLoading, error } = useGetCommentsQuery(articleId);

  const buildCommentTree = (comments: ArticleComment[]): ArticleComment[] => {
    const map = new Map<string, ArticleComment>();
    const rootComments: ArticleComment[] = [];

    for (const comment of comments) {
      map.set(comment._id, { ...comment, replies: [] });
    }

    for (const comment of comments) {
      const node = map.get(comment._id);
      if (!node) continue;

      if (comment.parentId && map.has(comment.parentId)) {
        const parent = map.get(comment.parentId);
        if (parent) parent.replies.push(node);
      } else {
        rootComments.push(node);
      }
    }

    return rootComments.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  };

  const comments = buildCommentTree(data)

  const sortedComments = useMemo(() => {
    const sorted = [...comments];

    sorted.sort((a, b) => {
      return sortOrder === "newest"
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

    return sorted;
  }, [comments, sortOrder]);

  const visibleComments = useMemo(() => {
    return sortedComments.slice(0, visibleCommentsCount)
  }, [sortedComments, visibleCommentsCount])

  const totalRootComments = comments.length
  const hasMoreComments = visibleCommentsCount < totalRootComments
  const remainingComments = totalRootComments - visibleCommentsCount

  const handleSortChange = (order: CommentSortOrder) => setSortOrder(order);
  const handleLoadMore = () => setVisibleCommentsCount((prev) => prev + CONFIG.COMMENTS_PER_ARTICLE_PAGE);

  if (isLoading) return <Loader />;

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <div className="flex flex-wrap items-center justify-center md:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Комментарии {comments.length > 0 && `(${comments.length})`}
        </h2>
        <CommentSortButtons
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
        />
      </div>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {"message" in error
            ? error.message
            : "Ошибка при загрзке комментариев"}
        </div>
      )}
      <div className="space-y-8">
        <CommentForm articleId={articleId} parentId={null} />
        <div className="space-y-6">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Пока нет комментариев. Будьте первым!
            </div>
          ) : (
            <div>
              {visibleComments.map((comment) => (
                <CommentItem
                  key={comment._id}
                  comment={comment}
                  articleId={articleId}
                  depth={0}
                />
              ))}
              <LoadMoreCommentsButton
                hasMore={hasMoreComments}
                remainingCount={remainingComments}
                onLoadMore={handleLoadMore}
                totalRootComments={totalRootComments}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogComments;
