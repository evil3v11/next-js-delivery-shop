import { Article } from "@/types/entities";

export interface ArticleSortableItemProps {
  id: string;
  article: Article;
  displayNumericId: number | null;
}

export interface MobileArticleCardProps {
  article: Article;
  displayNumericId: number | null;
  isBeingDragged: boolean;
}

export type MobileArticleHeaderProps = Omit<
  ArticleSortableItemProps,
  "id"
>;
