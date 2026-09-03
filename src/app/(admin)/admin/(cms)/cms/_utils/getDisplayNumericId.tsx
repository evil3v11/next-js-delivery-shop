import { Article, Category } from "../_types";

export const getDisplayNumericId = <T extends Article | Category>(
  item: T,
): number | null => item.numericId;
