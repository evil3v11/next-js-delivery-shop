import { Article } from "@/types/entities";

export interface ArticlesSectionProps {
  title: string;
  viewAllBtn?: {
    text: string;
    href: string;
  };
  articles: Article[];
}
