import { Article, Category } from "../entities";

export type SortDirection = "asc" | "desc";

export type CategorySortField =
  | keyof Pick<Category, "numericId" | "name" | "slug" | "createdAt" | "author">
  | "articles";

export type ArticleSortField = keyof Pick<
  Article,
  | "numericId"
  | "name"
  | "slug"
  | "createdAt"
  | "author"
  | "status"
  | "isFeatured"
  | "createdAt"
  | "author"
  | "views"
  | "categoryName"
>;

export type CategoryFilterType =
  | keyof Pick<
      Category,
      "name" | "slug" | "description" | "author" | "keywords"
    >
  | "all";

export type ArticleFilterType =
  | keyof Pick<
      Article,
      | "name"
      | "slug"
      | "description"
      | "author"
      | "keywords"
      | "content"
      | "categoryName"
    >
  | "all";
