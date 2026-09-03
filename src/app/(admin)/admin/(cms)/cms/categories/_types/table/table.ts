import { Category } from "../../../../../../../../types/entities";

export interface CategoryTableProps {
  onDelete: (categoryId: string) => void;
  onEdit: (category: Category) => void;
  onReorder?: (reorderedItems: Category[]) => void;
}