import {
  ArticleSortField,
  CategorySortField,
  SortDirection,
} from "@/types/filters";

type SortField = ArticleSortField | CategorySortField;

type SortObject = {
  [K in SortField]: { [P in K]: 1 | -1 };
}[SortField];

export const buildSortObject = <T extends SortField>(
  sortBy: T,
  sortOrder: SortDirection,
): SortObject => {
  const sortDirection = sortOrder === "asc" ? 1 : -1;
  switch (sortBy) {
    case "name":
      return { name: sortDirection };
    case "articles":
      return { articles: sortDirection };
    case "slug":
      return { slug: sortDirection };
    case "categoryName":
      return { categoryName: sortDirection };
    case "isFeatured":
      return { isFeatured: sortDirection };
    case "status":
      return { status: sortDirection };
    case "author":
      return { author: sortDirection };
    case "createdAt":
      return { createdAt: sortDirection };
    case "views":
      return { views: sortDirection };
    case "numericId":
    default:
      return { numericId: sortDirection };
  }
};
