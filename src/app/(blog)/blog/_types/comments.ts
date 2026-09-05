import { ApiResponse } from "@/types/api/default-response";
import { UserRole } from "@/types/userData";

export type CommentSortOrder = "newest" | "oldest";

export type ArticleComment = {
  _id: string;
  articleId: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  content: string;
  parentId: string | null;
  replies: ArticleComment[];
  createdAt: Date | string;
  updatedAt: Date | string;
  likes: string[];
  isEdited: boolean;
  editedAt?: string;
  articleName?: string;
  articleSlug?: string;
  categorySlug?: string;
  isDeleted?: string;
  deletedAt?: Date | string;
};

export type DeletedComment = Pick<
  ArticleComment,
  "content" | "updatedAt" | "isDeleted" | "deletedAt"
>;

export type EditedCommentData = Pick<
  ArticleComment,
  "content" | "isEdited" | "editedAt"
>;

export type LikeCommentData = {
  likeCount: number;
  isLiked: boolean;
}

export type GetCommentsResponse = ApiResponse & {
  data: ArticleComment[];
};

export type PostCommentResponse = ApiResponse & {
  data?: ArticleComment;
};

export type PatchCommentResponse = ApiResponse & {
  data?: EditedCommentData;
};

export type DeleteCommentResponse = ApiResponse & {
  data?: DeletedComment;
};

export type LikeCommentResponse = ApiResponse & {
  data?: LikeCommentData
}

export interface CommentItemProps {
  comment: ArticleComment;
  articleId: string;
  depth: number;
}

export interface CommentFormProps {
  articleId: string;
  parentId: string | null;
  closeForm?: () => void;
  placeholder?: string;
}

export interface CommentHeaderProps {
  comment: ArticleComment;
  canEdit: boolean;
  canDelete: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
  deleteButtonTitle: string;
}

export interface CommentAvatarProps {
  authorId: string;
  authorName: string;
}

export interface CommentRepliesProps {
  replies: ArticleComment[];
  articleId: string;
  depth: number;
}

export interface CommentActionsProps {
  isLiked: boolean;
  likeCount: number;
  canReply: boolean;
  onLike: () => void;
  onReply: () => void;
  isLiking: boolean;
  currentUserId?: string;
}

export interface CommentEditFormProps {
  commentId: string;
  initialContent: string;
  userId: string;
  onSuccess: (content: string, editedAt: string) => void;
  onCancel: () => void;
}

export interface CommentSortButtonsProps {
  sortOrder: CommentSortOrder;
  onSortChange: (order: CommentSortOrder) => void;
}

export interface LoadMoreCommentsProps {
  hasMore: boolean;
  remainingCount: number;
  onLoadMore: () => void;
  totalRootComments: number;
}
