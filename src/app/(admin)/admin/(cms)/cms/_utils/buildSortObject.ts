import { SortDirection, SortField } from "../categories/_types";

type SortObject = {
  [K in SortField]: { [P in K]: 1 | -1; };
}[SortField];

export const buildSortObject = (
  sortBy: SortField,
  sortOrder: SortDirection,
): SortObject => {
  const sortDirection = sortOrder === "asc" ? 1 : -1;
  switch (sortBy) {
    case "name":
      return { name: sortDirection };
    case "slug":
      return { slug: sortDirection };
    case "createdAt":
      return { createdAt: sortDirection };
    case "author":
      return { author: sortDirection };
    case "numericId":
    default:
      return { numericId: sortDirection };
  }
};
