import type { Article } from "./article";

export type Category = {
  _id: string;
  numericId: number;
  name: string;
  slug: string;
  description: string;
  keywords: string[];
  image: string;
  imageAlt: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  numberOfArticles: number;
};

export interface CategoryImageProps {
  category: Category;
  gradientColor: string;
  hasImage: boolean;
}

export interface CategoryHeaderProps {
  title: string;
  description?: string;
}

export interface CategoryStatsProps {
  totalArticles: number;
  currentPage: number;
  totalPages: number;
  articlesCount: number;
}

export interface CategoryPageResponse {
  category: Category;
  articles: Article[];
  totalArticles: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}
