import { Category } from "../../../../_types/entities";

export interface CategoryTableProps {
  onDelete: (categoryId: string) => void;
  onEdit: (category: Category) => void;
  onReorder?: (reorderedItems: Category[]) => void;
}

export type SortField = keyof Pick<
  Category,
  "numericId" | "name" | "slug" | "createdAt" | "author"
>;

export type SortDirection = "asc" | "desc";

export type FilterType =
  | keyof Pick<
      Category,
      "name" | "slug" | "description" | "author" | "keywords"
    >
  | "all";
