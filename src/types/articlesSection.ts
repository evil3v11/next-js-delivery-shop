import { Article } from "./articles";

export interface ArticlesSectionProps {
  title: string;
  viewAllBtn: {
    text: string;
    href: string;
  };
  articles: Article[];
  compact?: boolean;
}
