import { FilterType } from "../_types";

export const buildFilterQuery = (query: string, filterBy: FilterType) => {
  if (!query.trim()) return {};

  const regex = { $regex: query.toLowerCase().trim(), $options: "i" };

  switch (filterBy) {
    case "name":
      return { name: regex };
    case "slug":
      return { slug: regex };
    case "description":
      return { description: regex };
    case "author":
      return { author: regex };
    case "keywords":
      return { keywords: { $elemMatch: regex } };
    case "all":
    default:
      return {
        $or: [
          { name: regex },
          { slug: regex },
          { description: regex },
          { author: regex },
          { keywords: { $elemMatch: regex } },
        ],
      };
  }
};
