import { ArticleFilterType, CategoryFilterType } from "@/types/filters";

type FilterType = ArticleFilterType | CategoryFilterType;

export const buildFilterQuery = <T extends FilterType>(
  query: string,
  filterBy: T,
) => {
  if (!query.trim()) return {};

  const regex = { $regex: query.toLowerCase().trim(), $options: "i" };

  switch (filterBy) {
    case "name":
      return { name: regex };
    case "slug":
      return { slug: regex };
    case "content":
      return { content: regex };
    case "description":
      return { description: regex };
    case "keywords":
      return { keywords: { $elemMatch: regex } };
    case "author":
      return { author: regex };
    case "categoryName":
      return { categoryName: regex };
    case "all":
    default:
      return {
        $or: [
          { name: regex },
          { slug: regex },
          { content: regex },
          { description: regex },
          { keywords: { $elemMatch: regex } },
          { author: regex },
          { categoryName: regex },
        ],
      };
  }
};
