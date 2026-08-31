import { Article } from "@/types/entities";

export type SearchArticle = Article & {
  category: {
    slug: string;
    name: string;
  };
  categorySlug: string;
  categoryName: string;
};

export type SearchResult = {
  articles: SearchArticle[] | null;
  query?: string;
};