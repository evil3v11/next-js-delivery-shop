import { ArticleCardProps } from "./articles";

export interface ArticlesSectionProps {
  title: string;
  viewAllBtn?: {
    text: string;
    href: string;
  };
  articles: ArticleCardProps[];
  compact?: boolean;
}
