import { ArticleComment } from "@/app/(blog)/blog/_types";
import { ApiResponse } from "@/types/api/default-response";

export interface DateFilterProps {
  dateFrom: string;
  dateTo: string;
  activeFilter: string;
  onDateFromChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDateToChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSetToday: () => void;
  onSetLast3Days: () => void;
  onSetLastWeek: () => void;
  onSetLastMonth: () => void;
  onClearFilters: () => void;
  getTodayDate: () => string;
}

export interface CommentRowProps {
  comment: ArticleComment;
  deletingId: string | null;
  onDelete: (commentId: string) => void;
}

export interface CommentsListProps {
  comments: ArticleComment[];
  isLoading: boolean;
  deletingId: string | null;
  onDelete: (commentId: string) => void;
}

export interface CommentsPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface LoadCommentsParams {
  page?: number;
  dateFrom?: string;
  dateTo?: string;
  author?: string;
  article?: string;
}

export interface BanUserModalProps {
  ref: React.RefObject<HTMLDivElement | null>
  onClose: () => void;
  onBan: (days: number | null) => void;
  onUnban: () => void;
  userName: string;
  userId: string;
  isBanned: boolean;
  bannedUntil?: string | null;
}

export interface CommentsFiltersProps {
  dateFrom: string;
  dateTo: string;
  activeFilter: string;
  authorFilter: string;
  articleFilter: string;
  onDateFromChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDateToChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSetToday: () => void;
  onSetLast3Days: () => void;
  onSetLastWeek: () => void;
  onSetLastMonth: () => void;
  onApplyFilters: (author: string, article: string) => void;
  onClearFilters: () => void;
  getTodayDate: () => string;
}

export interface CommentFilter {
  createdAt?: {
    $gte?: Date;
    $lte?: Date;
  };
  authorName?: { $regex: string; $options: string };
  articleId?: { $in: string[] };
}

export type StoreType = {
  totalPages: number;
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  setCurrentPage: (page: number) => void;
};

export type GetCommentsWithPaginationResponse = ApiResponse & {
  data: {
    comments: ArticleComment[];
    page?: number;
    limit?: number;
    totalAllItems: number;
    totalFilteredItems: number;
    totalPages: number;
  };
};
